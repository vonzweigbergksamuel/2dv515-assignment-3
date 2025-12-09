import * as fs from "node:fs";
import * as path from "node:path";
import * as csv from "fast-csv";
import z from "zod";

export const blogSchema = z.object({
	id: z.number(),
	name: z.string(),
	wordCounts: z.record(z.string(), z.number()),
});
export type Blog = z.infer<typeof blogSchema>;

let cachedBlogs: Blog[] | null = null;

export const getParsedBlogs = async (): Promise<Blog[] | undefined> => {
	if (cachedBlogs) {
		return cachedBlogs;
	}

	const blogs: Blog[] = [];
	let wordHeaders: string[] = [];

	await new Promise((resolve, reject) => {
		fs.createReadStream(path.resolve("datasets", "blogdata.txt"))
			.pipe(csv.parse({ headers: true, delimiter: "\t" }))
			// biome-ignore lint/suspicious/noExplicitAny: Ok
			.on("error", (error: any) => reject(error))
			.on("headers", (headers: string[]) => {
				wordHeaders = headers.slice(1);
			})
			// biome-ignore lint/suspicious/noExplicitAny: Ok
			.on("data", (row: any) => {
				const wordCounts: Record<string, number> = {};
				for (const word of wordHeaders) {
					wordCounts[word] = Number(row[word]) || 0;
				}

				const obj = {
					id: blogs.length + 1,
					name: row.Blog,
					wordCounts,
				};

				blogSchema.safeParse(obj);

				blogs.push(obj);
			})
			.on("end", resolve);
	});

	cachedBlogs = blogs;
	return blogs;
};
