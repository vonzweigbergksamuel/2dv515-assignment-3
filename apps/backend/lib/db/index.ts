import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../../env.js";
import { schema } from "./schema/index.js";

export const client = new Pool({
	host: env.DATABASE_HOST,
	port: env.DATABASE_PORT,
	user: env.DATABASE_USER,
	password: env.DATABASE_PASSWORD,
	database: env.DATABASE_NAME,
	ssl: false,
});

export const db = drizzle(client, { schema });
