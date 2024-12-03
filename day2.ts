import * as fs from 'fs';

const parseFile = (filePath: string): number[][] =>
	fs.readFileSync(filePath, 'utf8')
		.split('\n')
		.filter(line => line.trim() !== '')
		.map(line => line.split(' ').map(Number));


// convert from histogram to difference
const convert = (arr: number[]): number[] =>
	// [4, 5, 8] => [1, 3]
	arr
		.map((val, i, arr) => i < arr.length - 1 ? arr[i + 1] - val : null)
		.filter(val => val !== null);

const safe = (differences: number[]): boolean =>
	// all are positive or all are negative
	// abs minimum is 1 and maximum is 3
	(differences.map(Math.sign).every(sign => sign === 1) || differences.map(Math.sign).every(sign => sign === -1)) && differences.every(diff => Math.abs(diff) <= 3 && Math.abs(diff) >= 1);


const dampenerBruteSafe = (report: number[]): boolean => {
	if (safe(convert(report))) return true;
	for (let i = 0; i < report.length; i++) {
		// new report is report without element at i
		const new_report = report.slice(0, i).concat(report.slice(i + 1));
		if (safe(convert(new_report))) return true;
	}
	return false;
}

const reports = parseFile('resources/day2_input.txt');
const differences = reports.map(convert);

console.log('reports:', reports);
console.log('differences:', differences);
console.log('safe reports count', reports.filter(dampenerBruteSafe).length);
