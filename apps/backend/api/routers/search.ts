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
				force: z.coerce.boolean().optional().default(false),
				query: z.string(),
			}),
		)
		.output(outputSchema)
		.handler(async ({ input }) => {
			return await search(input.query);
		}),
};
