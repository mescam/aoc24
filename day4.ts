import * as fs from 'fs';

const file = fs.readFileSync("resources/day4_input.txt", "utf-8").trim();

const wordsearch = file.split("\n").map((row) => row.split(""));

console.log(wordsearch);

const word = "XMAS";

const directions: [number, number][] = [
	[-1, -1], [-1, 0], [-1, 1],
	[0, -1], [0, 1],
	[1, -1], [1, 0], [1, 1]
];


const findWord = (wordsearch: string[][], i: number, j:number, iword: number, dir: ([number, number])): boolean => {
	if (i < 0 || i >= wordsearch.length || j < 0 || j >= wordsearch[i].length) {
		return false;
	}
	if (wordsearch[i][j] !== word[iword]) {
		return false;
	}
	if (iword == word.length - 1) {
		return true;
	}
	return findWord(wordsearch, i + dir[0], j + dir[1], iword + 1, dir);
}

let words_found = 0;
for (let i = 0; i < wordsearch.length; i++) {
	for (let j = 0; j < wordsearch[i].length; j++) {
		for (let n = 0; n < directions.length; n++) {
			if (findWord(wordsearch, i, j, 0, directions[n])) {
				console.log("Word found at", i, j, directions[n]);
				words_found++;
			}
		}
	}
}

console.log('part 1', words_found);

// now finding
// M.S
// .A.
// M.S

const findWord2 = (wordsearch: string[][], i: number, j: number): boolean => {
	// check bounds with 1 offset
	if (i < 1 || i >= wordsearch.length - 1 || j < 1 || j >= wordsearch[i].length - 1) {
		return false;
	}

	// check middle A
	if (wordsearch[i][j] !== 'A') {
		return false;
	}
	// [-1, -1] is M and [1, 1] is S or [-1, -1] is S and [1, 1] is M
	if (!((wordsearch[i - 1][j - 1] === 'M' && wordsearch[i + 1][j + 1] === 'S') || (wordsearch[i - 1][j - 1] === 'S' && wordsearch[i + 1][j + 1] === 'M'))) {
		return false;
	}
	// second diagonal
	// [-1, 1] is M and [1, -1] is S or [-1, 1] is S and [1, -1] is M
	if (!((wordsearch[i - 1][j + 1] === 'M' && wordsearch[i + 1][j - 1] === 'S') || (wordsearch[i - 1][j + 1] === 'S' && wordsearch[i + 1][j - 1] === 'M'))) {
		return false;
	}

	return true;
}

let words2_found = 0;
for (let i = 0; i < wordsearch.length; i++) {
	for (let j = 0; j < wordsearch[i].length; j++) {
		if (findWord2(wordsearch, i, j)) {
			console.log("Word found at", i, j);
			words2_found++;
		}
	}
}

console.log('part 2', words2_found);
