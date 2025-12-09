import * as z from "zod";
import { search } from "../controllers/search.js";
import { publicProcedure } from "../index.js";

const outputSchema = z.array(
	z.object({
		id: z.number(),
		name: z.string(),
		wordFrequency: z.number(),
	}),
);

export const searchRouter = {
	search: publicProcedure
		.route({ method: "GET" })
		.input(
			z.object({
				query: z.string(),
				limit: z.number().optional().default(5),
				force: z.boolean().optional().default(false),
			}),
		)
		.output(outputSchema)
		.handler(async ({ input }) => {
			console.log(`Search request: ${input.query}, force: ${input.force}`);
			return await search(input.query, input.limit, input.force);
		}),
};
