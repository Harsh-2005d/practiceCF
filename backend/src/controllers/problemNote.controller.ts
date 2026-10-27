import { randomUUID } from "crypto";
import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prismac";

const MAX_NOTE_LENGTH = 10_000;
const PROBLEM_ID_PATTERN = /^([1-9]\d*)-([A-Za-z0-9]+)$/;

function getProblemId(req: AuthedRequest, res: Response): string | null {
  const param = req.params.problemId;
  if (typeof param !== "string") {
    res.status(400).json({ error: "Invalid Codeforces problem ID" });
    return null;
  }

  const problemId = param;
  const match = PROBLEM_ID_PATTERN.exec(problemId);
  const contestId = match ? Number(match[1]) : NaN;

  if (!match || !Number.isSafeInteger(contestId) || contestId > 2_147_483_647) {
    res.status(400).json({ error: "Invalid Codeforces problem ID" });
    return null;
  }

  return problemId;
}

export async function getProblemNote(req: AuthedRequest, res: Response) {
  const problemId = getProblemId(req, res);
  if (!problemId) return;

  try {
    const result = await prisma.query(
      `SELECT "problemId", content, "updatedAt"
       FROM "ProblemNote"
       WHERE "userId" = $1 AND "problemId" = $2`,
      [req.user!.userId, problemId]
    );

    const row = result.rows[0];
    return res.status(200).json({
      note: row
        ? {
            problemId: row.problemId,
            content: row.content,
            updatedAt: row.updatedAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Get problem note error:", error);
    return res.status(500).json({ error: "Failed to load note" });
  }
}

export async function saveProblemNote(req: AuthedRequest, res: Response) {
  const problemId = getProblemId(req, res);
  if (!problemId) return;

  const { content } = req.body ?? {};
  if (typeof content !== "string") {
    return res.status(400).json({ error: "Note content must be a string" });
  }
  if (content.trim().length === 0) {
    return res.status(400).json({ error: "Note content cannot be empty; delete the note to clear it" });
  }
  if (content.length > MAX_NOTE_LENGTH) {
    return res.status(400).json({ error: "Note content must be 10,000 characters or fewer" });
  }

  try {
    const result = await prisma.query(
      `INSERT INTO "ProblemNote" (id, "userId", "problemId", content, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT ("userId", "problemId")
       DO UPDATE SET content = EXCLUDED.content, "updatedAt" = CURRENT_TIMESTAMP
       RETURNING "problemId", content, "updatedAt"`,
      [randomUUID(), req.user!.userId, problemId, content]
    );

    return res.status(200).json({ note: result.rows[0] });
  } catch (error) {
    console.error("Save problem note error:", error);
    return res.status(500).json({ error: "Failed to save note" });
  }
}

export async function deleteProblemNote(req: AuthedRequest, res: Response) {
  const problemId = getProblemId(req, res);
  if (!problemId) return;

  try {
    await prisma.query(
      `DELETE FROM "ProblemNote" WHERE "userId" = $1 AND "problemId" = $2`,
      [req.user!.userId, problemId]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete problem note error:", error);
    return res.status(500).json({ error: "Failed to delete note" });
  }
}
