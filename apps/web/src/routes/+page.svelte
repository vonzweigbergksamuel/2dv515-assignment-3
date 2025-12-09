<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { orpc } from "$lib/api/client";

	const query = createQuery(() =>
		orpc.search.queryOptions({
			input: {
				force: true
			}
		}),
	);
</script>

<h1>2dv515 Assignment 3</h1>
<button on:click={() => query.refetch()} class="mb-4!">Refetch</button>

{#if query.isLoading}
	<p>Loading...</p>
{:else if query.isSuccess}
	<div class="grid grid-cols-3! gap-4!">
		
	</div>
{:else if query.isError}
	<p>{query.error?.message}</p>
{/if}
