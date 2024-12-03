import * as fs from 'fs';

// read file
const readFile = (filePath: string) => {
	return fs.readFileSync(filePath, 'utf8');
}

// regex for finding all mul(digit,digit) occurrences
const regex = /mul\((\d+),(\d+)\)/g;
const r_do = /do\(\)/g;
const r_dont = /don't\(\)/g;

type control = [boolean, number];

// get all mul operations with digits from string
const getMulOperations = (str: string) => {
	const groups = str.matchAll(regex);
	return groups;
}

// get all do positions
const doPositions = (str: string): control[] => {
	const dos: control[] = [[true, -1], ...Array.from(str.matchAll(r_do)).map(m => [true, Number(m.index)] as control)];
	console.log(dos);

	const donts = Array.from(str.matchAll(r_dont)).map(m => [false, Number(m.index)] as control);
	console.log(donts)
	// merge dos and dont
	const merged = dos.concat(donts).sort((a, b) => Number(a[1]) - Number(b[1]));
	return merged;
}

// find maximum index before position
const maxIndex = (doPos: control[], pos: number): boolean => {
	console.log('checking for pos:', pos);
	for (let i = doPos.length - 1; i >= 0; i--) {
		if (doPos[i][1] < pos) {
			console.log(pos, doPos[i][0])
			return doPos[i][0];
		}
	}
	return false
}

// main
const file = readFile('resources/day3_input.txt');

const matches = Array.from(getMulOperations(file));
const p1 = matches.map(match => Number(match[1]) * Number(match[2])).reduce((s, v) => s + v, 0)
console.log('part 1:', p1);

const dos = doPositions(file);
console.log('dos:', dos);
const p2 = matches.filter(match => maxIndex(dos, match.index)).map(m => Number(m[1]) * Number(m[2])).reduce((s, v) => s + v, 0);

console.log('part 2:', p2);

