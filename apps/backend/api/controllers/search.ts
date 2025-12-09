import { ORPCError } from "@orpc/server";
import { sql } from "drizzle-orm";
import { db } from "../../lib/db/index.js";
import { articlesTable } from "../../lib/db/schema/index.js";

interface ArticleByQuery {
	id: number;
	name: string;
	wordFrequency: number;
}

async function getArticlesByQuery(query: string): Promise<ArticleByQuery[]> {
	return await db
		.select({
			id: articlesTable.id,
			name: articlesTable.name,
			wordFrequency: sql<number>`(${articlesTable.wordCounts}->${query})::int`,
		})
		.from(articlesTable)
		.where(sql`(${articlesTable.wordCounts}->${query})::int > 0`)
		.orderBy(sql`(${articlesTable.wordCounts}->${query})::int DESC`)
		.limit(10);
}

function normalizeScore(articles: ArticleByQuery[]): ArticleByQuery[] {
	const max = Math.max(articles[0].wordFrequency, 1);
	return articles.map((article) => ({
		id: article.id,
		name: article.name,
		wordFrequency: article.wordFrequency / max,
	}));
}

export async function search(query: string): Promise<ArticleByQuery[]> {
	try {
		const articles = await getArticlesByQuery(query);

		if (articles.length === 0) {
			throw new ORPCError("NOT_FOUND", {
				message: "No matching articles found",
			});
		}

		return normalizeScore(articles);
	} catch (error) {
		if (error instanceof ORPCError) {
			throw error;
		}
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
}
