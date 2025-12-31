import { PrismaClient } from '@prisma/client';

// PrismaClient singleton pattern to avoid exhausting database connections during development hot-reloading
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
	// Attaching to globalThis ensures the same instance is reused across hot reloads
	globalThis.prisma = db;
}
