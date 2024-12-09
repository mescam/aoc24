import * as fs from 'fs';

const input = fs.readFileSync('resources/day9_input.txt', 'utf-8').trim().split('').map(Number);
if (input.length % 2 !== 0)
	input.push(0);

type Block = {
	type: 'FILE' | 'FREE';
	id: number;
	size: number;
	moved?: boolean;
}

const expanded = ((input: number[]): Block[] => {
	const filesystem: Block[] = [];
	let id = 0;
	for (let i = 0; i < input.length; i += 2) {
		// input[i] is file size
		// input [i+1] is free size
		// i is file id
		filesystem.push({ type: 'FILE', id: id, size: input[i] });
		filesystem.push({ type: 'FREE', id: id++, size: input[i + 1] });
	}
	return filesystem;
})(input);


const compressed = (fs: Block[]): Block[] => {
	const newFs: Block[] = [];
	let i = 0;
	let j = fs.length - 2; // last element is always free
	while (i < j) {
		const entry = fs[i];
		if (entry.type === 'FILE') {
			if (entry.size > 0) newFs.push(entry);
			i++;
			continue;
		}
		while (entry.size > 0) {
			// find file to move here from the end
			while (fs[j].type === 'FREE' || fs[j].size === 0) {
				j -= 1;
			}
			const to_move = Math.min(fs[i].size, fs[j].size);
			fs[j].size -= to_move;
			fs[i].size -= to_move;
			newFs.push({ type: 'FILE', id: fs[j].id, size: to_move });
		}
		i++;
	}
	return [...newFs, ...fs.slice(i, j + 1)];
}

const compressed2 = (fs: Block[]): Block[] => {
	for (let i = fs.length - 1; i >= 0; i--) {
		if (fs[i].type === 'FREE') continue;
		// we have a file, find first matching space
		for (let j = 0; j < i; j++) {
			if (fs[j].type === 'FREE' && fs[j].size >= fs[i].size && !fs[i].moved) {
				// decrease free space
				fs[j].size -= fs[i].size;
				fs[i].moved = true;
				// move i before j
				// and leave empty space on previous place
				fs = [...fs.slice(0, j), fs[i], ...fs.slice(j, i), { type: 'FREE', size: fs[i].size, id: -1 }, ...fs.slice(i + 1)];
				break;
			}
		}
		fs[i].moved = true; // i tried so hard and got so far
	}
	return fs;
}

const checksum = (fs: Block[]): number => {
	let sum = 0;
	let index = 0;
	for (let i = 0; i < fs.length; i++) {
		if (fs[i].type === 'FILE')
			sum += fs[i].id * (fs[i].size * index + (fs[i].size * (fs[i].size - 1) / 2));
		index += fs[i].size;
	}
	return sum;
}


const defragmented = compressed(JSON.parse(JSON.stringify(expanded)));
const defragmented2 = compressed2(JSON.parse(JSON.stringify(expanded)));
console.log('part 1', checksum(defragmented));

console.log('part 2', checksum(defragmented2));
