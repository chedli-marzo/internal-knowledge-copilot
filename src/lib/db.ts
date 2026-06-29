import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 has no built-in engine — it talks to Postgres through a driver
// adapter. PrismaPg uses the `pg` driver over the Neon connection string.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// One Prisma client, reused across hot reloads in dev (otherwise Next.js would
// open a new DB connection on every change and exhaust the pool).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
