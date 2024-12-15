import input from './resources/day13_input.txt' with { type: 'text' };

type Coordinates = { x: number; y: number };
type Group = {
	buttonA: Coordinates;
	buttonB: Coordinates;
	prize: Coordinates;
};


const parseInput = (input: string): Group[] =>
	input
		.trim()
		.split('\n\n')
		.map((group) => {
			const matches = group.matchAll(/X[+](\d+), Y[+](\d+)|X=(\d+), Y=(\d+)/g);
			const parseCoords = (match: RegExpMatchArray): Coordinates => {
				const x = parseInt(match[1] || match[3], 10);
				const y = parseInt(match[2] || match[4], 10);
				return { x, y };
			};

			const [buttonA, buttonB, prize] = Array.from(matches, parseCoords);
			return { buttonA, buttonB, prize };
		});



const groups = parseInput(input);

type Solution = { nA: number; nB: number } | null;

const solveLinear = (
	xA: number, yA: number,
	xB: number, yB: number,
	xTarget: number, yTarget: number
): Solution => {
	const det = xA * yB - xB * yA;

	if (det === 0) {
		return null;
	}

	const nA_base = (yB * xTarget - xB * yTarget) / det;
	const nB_base = (xA * yTarget - yA * xTarget) / det;

	if (!Number.isInteger(nA_base) || !Number.isInteger(nB_base)) {
		return null;
	}

	let nA = Math.round(nA_base);
	let nB = Math.round(nB_base);

	if (nA < 0 || nB < 0) {
		return null;
	}

	return { nA, nB };
}

const solve = (
	xA: number, yA: number,
	xB: number, yB: number,
	xTarget: number, yTarget: number): Solution => {
	return solveLinear(xA, yA, xB, yB, xTarget + 10000000000000, yTarget + 10000000000000);
}

const cost = (solution: Solution): number => 3 * solution!.nA + solution!.nB;


const result = groups.map(({ buttonA, buttonB, prize }) => solve(buttonA.x, buttonA.y, buttonB.x, buttonB.y, prize.x, prize.y)).filter((solution) => solution !== null).map(cost).reduce((a, b) => a + b, 0);

console.log('cost', result);
