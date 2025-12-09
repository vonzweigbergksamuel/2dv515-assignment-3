import { ORPCError } from "@orpc/server";
import { sql } from "drizzle-orm";
import * as z from "zod";
import { db } from "../../lib/db/index.js";
import { articlesTable } from "../../lib/db/schema/index.js";
import { publicProcedure } from "../index.js";

const outputSchema = z.array(
	z.object({
		id: z.number(),
		name: z.string(),
		wordFrequency: z.number(),
	}),
);

interface ArticleByQuery {
	id: number;
	name: string;
	wordFrequency: number;
}

function normalizeScore(articles: ArticleByQuery[]): ArticleByQuery[] {
	const max = Math.max(articles[0].wordFrequency, 1);
	return articles.map((article) => ({
		id: article.id,
		name: article.name,
		wordFrequency: article.wordFrequency / max,
	}));
}

export const searchRouter = {
	search: publicProcedure
		.route({ method: "GET" })
		.input(
			z.object({
				force: z.coerce.boolean().optional().default(false),
				query: z.string(),
			}),
		)
		.output(outputSchema)
		.handler(async ({ input }) => {
			const articles: ArticleByQuery[] = await db
				.select({
					id: articlesTable.id,
					name: articlesTable.name,
					wordFrequency: sql<number>`(${articlesTable.wordCounts}->${input.query})::int`,
				})
				.from(articlesTable)
				.where(sql`(${articlesTable.wordCounts}->${input.query})::int > 0`)
				.orderBy(sql`(${articlesTable.wordCounts}->${input.query})::int DESC`)
				.limit(10);

			if (articles.length === 0) {
				throw new ORPCError("NOT_FOUND", {
					message: "No matching articles found",
				});
			}

			const normalizedArticles = normalizeScore(articles);

			return normalizedArticles;
		}),
};
