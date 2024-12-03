import * as fs from 'fs';

function parseFileToArrays(filePath: string): { firstColumn: number[], secondColumn: number[] } {
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const lines = fileContent.split('\n').filter(line => line.trim() !== '');

	const firstColumn: number[] = [];
	const secondColumn: number[] = [];

	for (const line of lines) {
		const [first, second] = line.trim().split(/\s+/).map(Number);
		if (!isNaN(first) && !isNaN(second)) {
			firstColumn.push(first);
			secondColumn.push(second);
		}
	}

	return { firstColumn, secondColumn };
}

const filePath = 'resources/day1_input.txt'; // Replace with the actual file path
const { firstColumn, secondColumn } = parseFileToArrays(filePath);

console.log('First Column:', firstColumn);
console.log('Second Column:', secondColumn);

const sumDistance = (arr1: number[], arr2: number[]): number => arr1.sort((a, b) => a - b).reduce((sum, val, i) => sum + Math.abs(val - arr2.sort((a, b) => a - b)[i]), 0);

console.log('Sum distance:', sumDistance(firstColumn, secondColumn));

function calculateSimilarityScore(leftList: number[], rightList: number[]): number {
	const rightFrequency = rightList.reduce((freq, num) => {
		freq[num] = (freq[num] || 0) + 1; // Count occurrences of each number in the right list
		return freq;
	}, {} as Record<number, number>);

	return leftList.reduce((score, num) => {
		const countInRight = rightFrequency[num] || 0; // Get the count of the number in the right list
		return score + num * countInRight; // Add the weighted contribution to the score
	}, 0);
}

const similarityScore = calculateSimilarityScore(firstColumn, secondColumn);

console.log('Similarity Score:', similarityScore);
