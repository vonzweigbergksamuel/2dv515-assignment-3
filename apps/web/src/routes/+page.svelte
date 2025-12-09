<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { orpc } from "$lib/api/client";

	let searchQueryValue = $state("");

	const searchQuery = createQuery(() =>
		orpc.search.queryOptions({
			input: {
				force: true,
				query: searchQueryValue
			}
		}),
	);
</script>

<h1>2dv515 Assignment 3</h1>
<label for="searchQueryValue">Input a search query</label>
<input type="text" bind:value={searchQueryValue} class="max-w-sm!" id="searchQueryValue" />

{#if searchQuery.isLoading}
	<p>Loading...</p>
{:else if searchQuery.isSuccess}
	<div class="grid grid-cols-5! gap-4!">
		{#each searchQuery.data as article}
			<div class="bg-gray-700! rounded-md! py-4! px-6! flex flex-col! justify-between!">
				<p>{article.name}</p>
				<h3>{article.wordFrequency}</h3>
			</div>
		{/each}
	</div>
{:else if searchQuery.isError}
	<p>{searchQuery.error?.message}</p>
{/if}
