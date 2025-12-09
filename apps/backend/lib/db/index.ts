import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { articlesTable } from "./schema/index.js";

export const client = new Pool({
	host: process.env.DATABASE_HOST!,
	port: parseInt(process.env.DATABASE_PORT!, 10),
	user: process.env.DATABASE_USER!,
	password: process.env.DATABASE_PASSWORD!,
	database: process.env.DATABASE_NAME!,
	ssl: false,
});

export const db = drizzle(client, { schema: { articlesTable } });
