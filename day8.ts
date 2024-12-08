import * as fs from 'fs';

const map_input = fs.readFileSync("resources/day8_input.txt", "utf-8")
	.trim()
	.split('\n')
	.map(x => x.split(''));

const freqs: { [key: string]: [number, number][] } = {};

// build freqs lookup table
for (let i = 0; i < map_input.length; i++) {
	for (let j = 0; j < map_input[i].length; j++) {
		if (map_input[i][j] === '.')
			continue;
		const key = map_input[i][j];
		if (freqs[key] === undefined) {
			freqs[key] = [];
		}
		freqs[key].push([i, j]);
	}
}

const inBounds = (map: string[][], pos: [number, number]): boolean => {
	if (pos[0] < 0 || pos[0] >= map.length)
		return false;
	if (pos[1] < 0 || pos[1] >= map[pos[0]].length)
		return false;
	return true;
}

const computeThirdNode = (pos1: [number, number], pos2: [number, number]): [number, number] => {
	// pos2 is pivotal point, pos3 will be opposite of pos1
	const i = pos2[0] + (pos2[0] - pos1[0]);
	const j = pos2[1] + (pos2[1] - pos1[1]);

	return [i, j];
}

const computeResonatingNodes = (pos1: [number, number], pos2: [number, number]): [number, number][] => {
	const third = computeThirdNode(pos1, pos2);
	if (!inBounds(map_input, third))
		return [];
	else
		return [third, ...computeResonatingNodes(pos2, third)];
}


const nodes: [[number, number], string][] = [];
// for each frequency
for (const key in freqs) {
	const freq = freqs[key];
	// for each pair of nodes
	for (let i = 0; i < freq.length; i++) {
		for (let j = 0; j < freq.length; j++) {
			if (i === j) continue;
			const third = computeThirdNode(freq[i], freq[j]);
			if (inBounds(map_input, third)) {
				nodes.push([third, key]);
			}
		}
	}
}

// only unique positions
const unique = new Set(nodes.map(x => JSON.stringify(x[0])));
console.log('part 1', unique.size);

const nodes_extended: [[number, number], string][] = [];
for (const key in freqs) {
	const freq = freqs[key];
	for (let i = 0; i < freq.length; i++) {
		for (let j = 0; j < freq.length; j++) {
			if (i === j) continue;
			const resonating = computeResonatingNodes(freq[i], freq[j]);
			nodes_extended.push(...resonating.map(x => [x, key] as [[number, number], string]));
		}
	}
}
// add also the original nodes
for (const key in freqs) {
	const freq = freqs[key];
	for (const pos of freq) {
		nodes_extended.push([pos, key]);
	}
}

/// only unique positions
const unique_extended = new Set(nodes_extended.map(x => JSON.stringify(x[0])));
console.log('part 2', unique_extended.size);
