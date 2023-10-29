import type { Config } from "drizzle-kit";
import 'dotenv/config'

export default {
  schema: "./lib/models/schema.ts",
  out: "./lib/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL!,
  },
} satisfies Config;