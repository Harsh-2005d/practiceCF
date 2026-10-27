import { randomUUID } from "crypto";
import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prismac";

const MAX_TITLE_LENGTH = 160;
const MAX_CONTENT_LENGTH = 50_000;
const PROBLEM_ID_PATTERN = /^([1-9]\d*)-([A-Za-z0-9]+)$/;
const CATEGORIES = new Set(["DSA", "PROBLEM"]);
const FEED_PAGE_SIZE = 20;

function validateArticle(body: unknown) {
  if (!body || typeof body !== "object") return { error: "Article data is required" };
  const article = body as Record<string, unknown>;
  const title = typeof article.title === "string" ? article.title.trim() : "";
  const content = typeof article.content === "string" ? article.content : "";
  const category = article.category;
  const isPublic = article.isPublic === true;
  const rawProblemId = article.problemId;

  if (!title) return { error: "Title is required" };
  if (title.length > MAX_TITLE_LENGTH) return { error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer` };
  if (!CATEGORIES.has(String(category))) return { error: "Choose a valid article category" };
  if (!content.trim()) return { error: "Article content cannot be empty" };
  if (content.length > MAX_CONTENT_LENGTH) return { error: `Article content must be ${MAX_CONTENT_LENGTH} characters or fewer` };

  let problemId: string | null = null;
  if (category === "PROBLEM") {
    if (typeof rawProblemId !== "string" || !PROBLEM_ID_PATTERN.test(rawProblemId)) {
      return { error: "Enter a valid Codeforces problem ID such as 1234-A" };
    }
    const contestId = Number(rawProblemId.split("-")[0]);
    if (!Number.isSafeInteger(contestId) || contestId > 2_147_483_647) {
      return { error: "Enter a valid Codeforces problem ID" };
    }
    problemId = rawProblemId;
  }

  if (article.isPublic !== undefined && typeof article.isPublic !== "boolean") {
    return { error: "Article visibility must be public or private" };
  }

  return { value: { title, content, category: category as string, problemId, isPublic } };
}

export async function listBlogs(req: AuthedRequest, res: Response) {
  try {
    const result = await prisma.query(
      `SELECT id, title, category, "problemId", "isPublic", "createdAt", "updatedAt"
       FROM "Blog" WHERE "userId" = $1 ORDER BY "updatedAt" DESC`,
      [req.user!.userId],
    );
    return res.status(200).json({ blogs: result.rows });
  } catch (error) {
    console.error("List blogs error:", error);
    return res.status(500).json({ error: "Failed to load articles" });
  }
}

export async function getBlog(req: AuthedRequest, res: Response) {
  try {
    const result = await prisma.query(
      `SELECT id, title, category, "problemId", "isPublic", content, "createdAt", "updatedAt"
       FROM "Blog" WHERE id = $1 AND "userId" = $2`,
      [req.params.id, req.user!.userId],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
    return res.status(200).json({ blog: result.rows[0] });
  } catch (error) {
    console.error("Get blog error:", error);
    return res.status(500).json({ error: "Failed to load article" });
  }
}

export async function createBlog(req: AuthedRequest, res: Response) {
  const validated = validateArticle(req.body);
  if ("error" in validated) return res.status(400).json({ error: validated.error });

  try {
    const { title, category, problemId, content, isPublic } = validated.value;
    const result = await prisma.query(
      `INSERT INTO "Blog" (id, "userId", title, category, "problemId", content, "isPublic", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, title, category, "problemId", "isPublic", content, "createdAt", "updatedAt"`,
      [randomUUID(), req.user!.userId, title, category, problemId, content, isPublic],
    );
    return res.status(201).json({ blog: result.rows[0] });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({ error: "Failed to create article" });
  }
}

export async function updateBlog(req: AuthedRequest, res: Response) {
  const validated = validateArticle(req.body);
  if ("error" in validated) return res.status(400).json({ error: validated.error });

  try {
    const { title, category, problemId, content, isPublic } = validated.value;
    const result = await prisma.query(
      `UPDATE "Blog" SET title = $1, category = $2, "problemId" = $3, content = $4, "isPublic" = $5, "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $6 AND "userId" = $7
       RETURNING id, title, category, "problemId", "isPublic", content, "createdAt", "updatedAt"`,
      [title, category, problemId, content, isPublic, req.params.id, req.user!.userId],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
    return res.status(200).json({ blog: result.rows[0] });
  } catch (error) {
    console.error("Update blog error:", error);
    return res.status(500).json({ error: "Failed to update article" });
  }
}

function encodeFeedCursor(createdAt: Date | string, id: string) {
  return Buffer.from(JSON.stringify({ createdAt: new Date(createdAt).toISOString(), id })).toString("base64url");
}

function decodeFeedCursor(value: unknown): { createdAt: Date; id: string } | null {
  if (typeof value !== "string" || value.length > 512) return null;
  try {
    const decoded = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as {
      createdAt?: unknown;
      id?: unknown;
    };
    if (typeof decoded.createdAt !== "string" || typeof decoded.id !== "string" || decoded.id.length > 100) return null;
    const createdAt = new Date(decoded.createdAt);
    if (!Number.isFinite(createdAt.getTime())) return null;
    return { createdAt, id: decoded.id };
  } catch {
    return null;
  }
}

export async function listPublicBlogs(req: AuthedRequest, res: Response) {
  const cursorValue = req.query.cursor;
  const cursor = cursorValue === undefined ? null : decodeFeedCursor(cursorValue);
  if (cursorValue !== undefined && !cursor) {
    return res.status(400).json({ error: "Invalid feed cursor" });
  }

  try {
    const result = cursor
      ? await prisma.query(
          `SELECT b.id, b.title, b.category, b."problemId", b.content, b."createdAt", b."updatedAt", u.handle AS "authorHandle"
           FROM "Blog" b JOIN "User" u ON u.id = b."userId"
           WHERE b."isPublic" = true AND (b."createdAt", b.id) < ($1::timestamp, $2::text)
           ORDER BY b."createdAt" DESC, b.id DESC LIMIT $3`,
          [cursor.createdAt, cursor.id, FEED_PAGE_SIZE + 1],
        )
      : await prisma.query(
          `SELECT b.id, b.title, b.category, b."problemId", b.content, b."createdAt", b."updatedAt", u.handle AS "authorHandle"
           FROM "Blog" b JOIN "User" u ON u.id = b."userId"
           WHERE b."isPublic" = true
           ORDER BY b."createdAt" DESC, b.id DESC LIMIT $1`,
          [FEED_PAGE_SIZE + 1],
        );

    const hasMore = result.rows.length > FEED_PAGE_SIZE;
    const posts = result.rows.slice(0, FEED_PAGE_SIZE);
    const lastPost = posts.at(-1);
    return res.status(200).json({
      posts,
      nextCursor: hasMore && lastPost ? encodeFeedCursor(lastPost.createdAt, lastPost.id) : null,
    });
  } catch (error) {
    console.error("List public articles error:", error);
    return res.status(500).json({ error: "Failed to load public feed" });
  }
}

export async function getPublicBlog(req: AuthedRequest, res: Response) {
  try {
    const result = await prisma.query(
      `SELECT b.id, b.title, b.category, b."problemId", b.content, b."createdAt", b."updatedAt", u.handle AS "authorHandle"
       FROM "Blog" b JOIN "User" u ON u.id = b."userId"
       WHERE b.id = $1 AND b."isPublic" = true`,
      [req.params.id],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
    return res.status(200).json({ blog: result.rows[0] });
  } catch (error) {
    console.error("Get public article error:", error);
    return res.status(500).json({ error: "Failed to load article" });
  }
}

export async function deleteBlog(req: AuthedRequest, res: Response) {
  try {
    const result = await prisma.query(
      `DELETE FROM "Blog" WHERE id = $1 AND "userId" = $2 RETURNING id`,
      [req.params.id, req.user!.userId],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ error: "Failed to delete article" });
  }
}
