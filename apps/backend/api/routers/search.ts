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
	const max = Math.max(
		Math.max(...articles.map((article) => article.wordFrequency)),
		1,
	);
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
			console.log("query", input.query);

			const articles = await db
				.select()
				.from(articlesTable)
				.where(sql`(${articlesTable.wordCounts}->${input.query})::int > 0`);

			if (articles.length === 0) {
				throw new ORPCError("NOT_FOUND", {
					message: "No matching articles found",
				});
			}

			const sortedArticles = articles.sort((a, b) => {
				return (
					(b.wordCounts as Record<string, number>)[input.query] -
					(a.wordCounts as Record<string, number>)[input.query]
				);
			});
			const normalizedScores = normalizeScore(
				sortedArticles.map((article) => {
					const score = (article.wordCounts as Record<string, number>)[
						input.query
					];
					return {
						id: article.id,
						name: article.name,
						wordFrequency: score,
					};
				}),
			);

			console.log("normalizedScores", normalizedScores);

			return normalizedScores;
		}),
};
