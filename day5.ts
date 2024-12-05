import * as fs from 'fs';

type ordering = [number, number];

const file = fs.readFileSync('resources/day5_input.txt', 'utf-8').trim().split(/\n\s*\n/);

const rules = file[0].split('\n').map(x => x.trim().split('|').map(x => Number(x)) as ordering);
// turn rules to lookup table

const lookup: { [key: number]: number[] } = {}
for (const rule of rules) {
	if (lookup[rule[0]] === undefined) {
		lookup[rule[0]] = [];
	}
	lookup[rule[0]].push(rule[1]);
}

const updates = file[1].split('\n').map(x => x.trim().split(',').map(x => Number(x)));

// part 1

const middle_element = (update: number[]): number => update[Math.floor(update.length / 2)];
const correct = (update: number[]): boolean => {
	for (let i = 0; i < update.length; i++) {
		const before = update.slice(0, i);
		if (lookup[update[i]] !== undefined && lookup[update[i]].some(x => before.includes(x)))
			return false;
	}
	return true;
}


const sum = updates.filter(x => correct(x)).map(x => middle_element(x)).reduce((a, b) => a + b, 0);
console.log('part 1', sum);

// part 2
const lookup2: { [key: number]: number[] } = {}
for (const rule of rules) {
	if (lookup2[rule[1]] === undefined) {
		lookup2[rule[1]] = [];
	}
	lookup2[rule[1]].push(rule[0]);
}

const fixed = (update: Set<number>): number[] => {
	if (update.size == 0)
		return [];
	// find first element
	for (const elem of update) {
		const before = lookup2[elem];
		if (before === undefined || before.every(x => !update.has(x))) {
			return [elem, ...fixed(new Set([...update].filter(x => x !== elem)))];
		}
	}
	throw new Error('should not happen');
}

const sum2 = updates.filter(x => !correct(x)).map(x => fixed(new Set(x))).reduce((a, b) => a + middle_element(b), 0);
console.log('part 2', sum2);
