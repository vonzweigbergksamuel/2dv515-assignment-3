import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import pino from "pino";
import { appRouter } from "../../api/routers/index.js";

const logger = pino();

export const openApiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new CORSPlugin(),
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
		new LoggingHandlerPlugin({
			logger,
			generateId: () => crypto.randomUUID(),
			// logRequestResponse: true,
			// logRequestAbort: true
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const rpcHandler = new RPCHandler(appRouter, {
	plugins: [
		new CORSPlugin(),
		new LoggingHandlerPlugin({
			logger,
			generateId: () => crypto.randomUUID(),
			// logRequestResponse: true,
			// logRequestAbort: true
		}),
	],
});
