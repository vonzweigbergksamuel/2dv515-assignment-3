import type { AppRouterClient } from "@2dv515-assignment-2/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

const link = new RPCLink({
	url: `${PUBLIC_BACKEND_URL}/rpc`,
	headers: () => ({})
});

const apiClient: AppRouterClient = createORPCClient(link);
export const orpc = createTanstackQueryUtils(apiClient);
