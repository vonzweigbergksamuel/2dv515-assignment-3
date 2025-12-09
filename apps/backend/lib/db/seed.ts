import { parsedArticles } from "../utils/parser.js";
import { db } from "./index.js";
import { articlesTable } from "./schema/index.js";

async function run() {
	for (const article of parsedArticles) {
		await db.insert(articlesTable).values({
			name: article.name,
			category: article.category,
			wordCounts: article.wordCounts,
		});
	}

	console.log("Seeded database");
}

run();
