ALTER TABLE "Blog"
ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Blog_isPublic_createdAt_id_idx"
ON "Blog"("isPublic", "createdAt", id);
