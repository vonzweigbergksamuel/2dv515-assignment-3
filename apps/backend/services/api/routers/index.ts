import type { RouterClient } from "@orpc/server";
import * as z from "zod";
import { publicProcedure } from "../index.js";
import { searchRouter } from "./search.js";

export const appRouter = {
	healthCheck: publicProcedure
		.route({ method: "GET" })
		.output(z.object({ message: z.string(), timestamp: z.number() }))
		.handler(async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return { message: "OK", timestamp: Date.now() };
		}),
	...searchRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
