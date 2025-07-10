import { PrismaClient } from "./generated/prisma";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
