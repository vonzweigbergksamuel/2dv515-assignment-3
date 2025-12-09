import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", ["programming", "games"]);

export const articlesTable = pgTable("articles", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	name: text("name").notNull(),
	category: categoryEnum("category").notNull(),
	wordCounts: jsonb("word_counts").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
