import * as z from "zod";
import { publicProcedure } from "../index.js";

const outputSchema = z.array(
	z.object({
		id: z.number(),
		name: z.string(),
		wordCounts: z.record(z.string(), z.number()),
	}),
);

export const searchRouter = {
	search: publicProcedure
		.route({ method: "GET" })
		.input(
			z.object({
				force: z.coerce.boolean().optional().default(false),
			}),
		)
		.output(outputSchema)
		.handler(async () => {
			return [];
		}),
};
