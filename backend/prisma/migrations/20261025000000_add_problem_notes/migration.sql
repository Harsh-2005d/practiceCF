CREATE TABLE "ProblemNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemNote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProblemNote_userId_problemId_key"
    ON "ProblemNote"("userId", "problemId");

ALTER TABLE "ProblemNote"
    ADD CONSTRAINT "ProblemNote_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
