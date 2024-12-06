import * as fs from 'fs';

const map_input = fs.readFileSync("resources/day6_input.txt", "utf-8")
	.trim()
	.split('\n')
	.map(x => x.split(''));

const print = (map: string[][]) => {
	map.map(x => console.log(x.join('')));
}

type pos = [number, number];
type direction = '^' | '>' | '<' | 'v';

const position = ((map: string[][]): pos => {
	for (let i = 0; i < map.length; i++)
		for (let j = 0; j < map[i].length; j++)
			if (map[i][j] === '^')
				return [i, j];
	throw new Error("No starting position found");
})(map_input);

console.log('starting position is', position);

const patrol = (map: string[][], current: pos): [number?, ([pos, direction][])?] => {
	const visited: [pos, direction][] = [];
	let dir: direction = '^';
	const directions: direction[] = ['^', '>', 'v', '<'];
	// while we are not out of bounds
	while (current[0] >= 0 && current[0] < map.length && current[1] >= 0 && current[1] < map[current[0]].length) {
		// mark the position as visited
		if (!visited.some(x => (x[0][0] === current[0] && x[0][1] === current[1]) && x[1] === dir))
			visited.push([current, dir]);
		else
			return [undefined, undefined]; // loop detected
		do {
			const next_pos = ((): pos => {
				switch (dir) {
					case '^': return [current[0] - 1, current[1]];
					case '>': return [current[0], current[1] + 1];
					case 'v': return [current[0] + 1, current[1]];
					case '<': return [current[0], current[1] - 1];
				}
			})();
			if (map[next_pos[0]] !== undefined && map[next_pos[0]][next_pos[1]] !== undefined && map[next_pos[0]][next_pos[1]] === '#') {
				dir = directions[(directions.indexOf(dir) + 1) % 4];
			} else {
				current = next_pos;
				break;
			}
		} while (true);
	}
	return [(new Set(visited.map(x => JSON.stringify(x[0])))).size, visited]
}

const [nodes, path] = patrol(map_input, position);
if (nodes === undefined)
	console.log('loop detected');
else
	console.log('nodes visited', nodes);

if (!path) {
	throw new Error("wrong path");
}

const map_json = JSON.stringify(map_input);
const unique_pos = Array.from((new Set(path.map(x => JSON.stringify(x[0]))))).map(x => JSON.parse(x) as pos);
const loop_pos = new Set<string>;
console.log('unique positions', unique_pos.length);
for (const pos of unique_pos) {
	if (pos == position) continue;
	const cloned_map = JSON.parse(map_json) as string[][];
	// block the path
	cloned_map[pos[0]][pos[1]] = '#';
	if (cloned_map[pos[0]][pos[1]] !== '#')
		throw new Error('wrong blocking');
	// check if loop
	const [visited, paths] = patrol(cloned_map, position);
	if (visited === undefined) {
		loop_pos.add(JSON.stringify(pos));
	}
}

console.log('loops detected', loop_pos.size);


