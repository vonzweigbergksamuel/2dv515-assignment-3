import { ORPCError } from "@orpc/server";
import { sql } from "drizzle-orm";
import { db } from "../../lib/db/index.js";
import { articlesTable } from "../../lib/db/schema/index.js";

interface ArticleByQuery {
	id: number;
	name: string;
	wordFrequency: number;
}

const cachedQueries: Record<string, ArticleByQuery[]> = {};

async function getArticlesByQuery(
	query: string,
	limit: number,
	force: boolean,
): Promise<ArticleByQuery[]> {
	if (cachedQueries[query] && !force && cachedQueries[query].length === limit) {
		console.log(`Returning cached query: ${query}`);
		return cachedQueries[query];
	}

	const articles = await db
		.select({
			id: articlesTable.id,
			name: articlesTable.name,
			wordFrequency: sql<number>`(${articlesTable.wordCounts}->${query})::int`,
		})
		.from(articlesTable)
		.where(sql`(${articlesTable.wordCounts}->${query})::int > 0`)
		.orderBy(sql`(${articlesTable.wordCounts}->${query})::int DESC`)
		.limit(limit);

	cachedQueries[query] = articles;
	console.log(`Returning new query: ${query}`);
	return articles;
}

function normalizeScore(articles: ArticleByQuery[]): ArticleByQuery[] {
	const max = Math.max(articles[0].wordFrequency, 1);
	return articles.map((article) => ({
		id: article.id,
		name: article.name,
		wordFrequency: Number((article.wordFrequency / max).toFixed(2)),
	}));
}

export async function search(
	query: string,
	limit: number,
	force: boolean,
): Promise<ArticleByQuery[]> {
	try {
		const articles = await getArticlesByQuery(query, limit, force);

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
