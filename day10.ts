import * as fs from 'fs';
const map_input = fs.readFileSync(process.argv[2]!, 'utf-8').trim().split('\n').map(x => x.split('').map(Number));


type Pos = [number, number];
const start_positions = ((map: number[][]): Pos[] =>
	// return all positions [i,j] where value is 0
	map.reduce((acc, row, i) => row.reduce((acc, cell, j) => { if (cell === 0) acc.push([i, j]); return acc; }, acc), [] as Pos[]))(map_input);

console.log(start_positions);

const hikes = (map: number[][], start: Pos, val: number, path: Pos[]): Pos[][] => {
	// check if start is out of bounds
	if (start[0] < 0 || start[0] >= map.length || start[1] < 0 || start[1] >= map[0].length) return [];
	if (map[start[0]][start[1]] !== val) return [];
	if (map[start[0]][start[1]] === 9) return [[...path, start]];

	// 4 directions
	const up = hikes(map, [start[0] - 1, start[1]], val + 1, [...path, start]);
	const down = hikes(map, [start[0] + 1, start[1]], val + 1, [...path, start]);
	const left = hikes(map, [start[0], start[1] - 1], val + 1, [...path, start]);
	const right = hikes(map, [start[0], start[1] + 1], val + 1, [...path, start]);

	return [...up, ...down, ...left, ...right];
}

const trailheads: { [key: string]: Pos[][] } = {}
start_positions.forEach(start => {
	trailheads[JSON.stringify(start)] = hikes(map_input, start, 0, []);
})

let sum = 0;
Object.keys(trailheads).forEach(key => {
	const paths: Pos[][] = trailheads[key]
	const unique_lasts = new Set(paths.map(x => JSON.stringify(x[x.length - 1])));
	sum += unique_lasts.size;
})
console.log(sum);


// part 2 is distinct
const sum2 = Object.values(trailheads).reduce((acc, val) => acc += val.length, 0);
console.log('part 2:', sum2);
