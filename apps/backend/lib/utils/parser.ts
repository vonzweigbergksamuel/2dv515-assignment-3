import * as fs from "node:fs/promises";
import * as path from "node:path";
import z from "zod";

export const articleSchema = z.object({
	id: z.number(),
	name: z.string(),
	category: z.enum(["programming", "games"]),
	wordCounts: z.record(z.string(), z.number()),
});
export type Article = z.infer<typeof articleSchema>;

const datasetPath = (category: Article["category"]) =>
	path.resolve("dataset", "wikipedia", "words", category);

const countWords = (text: string): Record<string, number> => {
	const wordCounts: Record<string, number> = {};
	const words = text.toLowerCase().split(/\s+/);

	for (const word of words) {
		if (word) {
			wordCounts[word] = (wordCounts[word] || 0) + 1;
		}
	}

	return wordCounts;
};

const parseArticlesByCategory = async (
	category: Article["category"],
): Promise<Article[]> => {
	const articles: Article[] = [];
	const dirPath = datasetPath(category);
	const files = await fs.readdir(dirPath);

	for (let i = 0; i < files.length; i++) {
		const filename = files[i];
		const filePath = path.join(dirPath, filename);
		const stat = await fs.stat(filePath);

		if (!stat.isFile()) continue;

		const content = await fs.readFile(filePath, "utf-8");
		const wordCounts = countWords(content);

		const article: Article = {
			id: i + 1,
			name: filename.replace(/_/g, " "),
			category,
			wordCounts,
		};

		articles.push(article);
	}

	return articles;
};

const categories = await fs
	.readdir(path.resolve("dataset", "wikipedia", "words"))
	.then((categories) =>
		categories.filter((category) => category !== ".DS_Store"),
	);

export const parsedArticles = await Promise.all(
	categories.map((category: string) =>
		parseArticlesByCategory(category as Article["category"]),
	),
).then((articles) => articles.flat());
