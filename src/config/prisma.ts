import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { env } from "../config/env";

const connectionString = env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});
