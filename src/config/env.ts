import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number(),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_REFRESH_EXPIRES_IN: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(JSON.stringify(parsedEnv.error.issues, null, 2));

  process.exit(1);
}

export const env = parsedEnv.data;
