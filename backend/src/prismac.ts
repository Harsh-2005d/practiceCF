import pg from "pg";

export const prisma = new pg.Client({
  connectionString:
    "postgres://wolverine:dahiya2809@localhost:5432/practicecf?sslmode=disable",
});
