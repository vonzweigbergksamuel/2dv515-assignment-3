import { parsedArticles } from "../utils/parser.js";
import { db } from "./index.js";
import { articlesTable } from "./schema/index.js";

async function run() {
	let count: number = 0;
	const errors: string[] = [];

	for (const article of parsedArticles) {
		try {
			await db.insert(articlesTable).values({
				name: article.name,
				category: article.category,
				wordCounts: article.wordCounts,
			});
			count++;
		} catch (error) {
			errors.push(
				`${article.name}: ${error instanceof Error ? error.cause : "Unknown error"}`,
			);
		}
	}

	console.log(`Seeded ${count} articles`);
	if (errors.length > 0) {
		console.error(`Failed to seed ${errors.length} articles`);
		console.error(errors.join(", "));
	}
}

run();
