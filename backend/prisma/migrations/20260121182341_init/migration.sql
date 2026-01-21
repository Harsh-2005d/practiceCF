-- CreateTable
CREATE TABLE "Solve" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "problemName" TEXT,
    "link" TEXT NOT NULL,
    "solvedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "handle" TEXT,
    "rating" INTEGER,
    "oauthProvider" TEXT NOT NULL,
    "oauthId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solve_userId_contestId_index_key" ON "Solve"("userId", "contestId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthId_key" ON "User"("oauthId");

-- AddForeignKey
ALTER TABLE "Solve" ADD CONSTRAINT "Solve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
