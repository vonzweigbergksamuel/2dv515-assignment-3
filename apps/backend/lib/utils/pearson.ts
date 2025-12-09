export type WordCounts = Record<string, number>;

export function pearson(
	wordCountsA: WordCounts,
	wordCountsB: WordCounts,
	allWords?: string[],
): number {
	let sumA: number = 0;
	let sumB: number = 0;
	let sumASquared: number = 0;
	let sumBSquared: number = 0;
	let productSum: number = 0;

	const words =
		allWords ||
		Array.from(
			new Set([...Object.keys(wordCountsA), ...Object.keys(wordCountsB)]),
		);
	const numWords = words.length;

	for (const word of words) {
		const countA = wordCountsA[word] || 0;
		const countB = wordCountsB[word] || 0;

		sumA += countA;
		sumB += countB;
		sumASquared += countA ** 2;
		sumBSquared += countB ** 2;
		productSum += countA * countB;
	}

	const numerator = productSum - (sumA * sumB) / numWords;
	const denominator = Math.sqrt(
		(sumASquared - sumA ** 2 / numWords) * (sumBSquared - sumB ** 2 / numWords),
	);

	if (denominator === 0) {
		return 0;
	}

	return 1 - numerator / denominator;
}
