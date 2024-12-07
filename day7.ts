import * as fs from 'fs';

const input = fs.readFileSync("resources/day7_input.txt", "utf-8").trim().split('\n');
const re = /(\d+!):|\b(\d+)\b/g;
const equations = input.map(line => Array.from(line.trim().match(re)!).map(x => Number(x)));


const solvable = (result: number, elements: number[]): number => {
	const solve = (elements: number[]): number => {
		if (elements.length >= 2) {
			// reaminder list
			const rest = elements.slice(2);
			const added = elements[0] + elements[1];
			const multiplied = elements[0] * elements[1];
			// third operator - concatenate
			const concatenated = Number(elements[0].toString() + elements[1].toString());

			// solve for the rest
			return solve([added, ...rest]) + solve([multiplied, ...rest]) + solve([concatenated, ...rest])
		}
		if (elements.length == 1 && elements[0] == result)
			return 1;
		else
			return 0;
	}

	return solve(elements);
}

let sum = 0;
for (const equation of equations) {
	const result = solvable(equation[0], equation.slice(1));
	if (result > 0)
		sum += equation[0];
}

console.log('part 2', sum);
