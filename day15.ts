import input from './resources/day15_input.txt' with { type: 'text' };


const parseInput = (input: string): [string[][], string[]] => {
	const s = input.trim().split('\n\n');

	const map = s[0].trim().split('\n').map(l => l.trim().split(''));
	const mvmt = s[1].trim().split('\n').join('').split('');

	return [map, mvmt];
}

const printColorfulMap = (map: string[][]): void => {
	const colors: { [k: string]: string } = {
		'#': '\x1b[41m \x1b[0m',
		'@': '\x1b[42m@\x1b[0m',
		'.': '\x1b[44m \x1b[0m',
		'O': '\x1b[45mO\x1b[0m',
		'[': '\x1b[45m[\x1b[0m',
		']': '\x1b[45m]\x1b[0m',
	};
	map.forEach(row => {
		console.log(row.map(c => colors[c]!).join(''));
	});
}


const [map, mvmt] = parseInput(input);

console.log(map, mvmt);

// # - wall
// @ - robot
// . - empty
// O - box
// box can be pushed, unless they hit a wall, then no movement
const delta_dir: { [key: string]: [number, number] } = {
	'^': [-1, 0],
	'>': [0, 1],
	'<': [0, -1],
	'v': [1, 0]
};

const move = (map: string[][], mvmt: string): string[][] => {
	// find robot
	const robot = map.reduce((acc, row, i) => {
		const j = row.indexOf('@');
		if (j !== -1) {
			acc = [i, j];
		}
		return acc;
	}, [-1, -1]);
	if (robot[0] === -1) {
		throw new Error('Robot not found');
	}

	// create deep copy of map
	const new_map = map.map(row => row.slice());

	const new_pos = [robot[0] + delta_dir[mvmt]![0], robot[1] + delta_dir[mvmt]![1]];

	const travel: [number, number][] = []
	while (map[new_pos[0]][new_pos[1]] === 'O') {
		travel.push([new_pos[0], new_pos[1]]);
		new_pos[0] += delta_dir[mvmt]![0];
		new_pos[1] += delta_dir[mvmt]![1];
	}

	// if we hit a wall, no movement at all
	if (new_map[new_pos[0]][new_pos[1]] === '#') {
		return map;
	}

	// if new_pos is empty, shift robot and boxes according to travel
	if (new_map[new_pos[0]][new_pos[1]] === '.') {
		for (let i = travel.length - 1; i >= 0; i--) {
			new_map[new_pos[0]][new_pos[1]] = map[travel[i][0]][travel[i][1]];
			new_pos[0] = travel[i][0]; new_pos[1] = travel[i][1];
		}
		// move robot
		new_map[new_pos[0]][new_pos[1]] = '@';
		new_map[robot[0]][robot[1]] = '.';
	}

	return new_map;
}

const gps_pos = (pos: [number, number]): number => 100 * pos[0] + pos[1];


let new_map = map.map(row => row.slice());
for (const m of mvmt) {
	console.log('moving ', m);
	new_map = move(new_map, m);
	//printColorfulMap(new_map);
	//console.log('------------------');
	//prompt("press enter to continue");
}

let sum = 0;
// find all boxes positions
for (let i = 0; i < new_map.length; i++) {
	for (let j = 0; j < new_map[i].length; j++) {
		if (new_map[i][j] === 'O') {
			sum += gps_pos([i, j]);
		}
	}
}

console.log('sum:', sum);


///////////////////////////////////////////
// PART 2
/*
 * To get the wider warehouse's map, start with your original map and, for each tile, make the following changes:
If the tile is #, the new map contains ## instead.
If the tile is O, the new map contains [] instead.
If the tile is ., the new map contains .. instead.
If the tile is @, the new map contains @. instead.
*/
type Pos = [number, number];
type BoxPos = [Pos, Pos];

const delta_dir2: { [key: string]: [number, number] } = {
	'^': [-1, 0],
	'>': [0, 2],
	'<': [0, -2],
	'v': [1, 0]
};
const neighbours = (map: string[][], box: BoxPos, dir: string, depth: number): [(BoxPos | string), number][] => {
	const [[x1, y1], [x2, y2]] = box;
	switch (dir) {
		case '>': {
			if (map[box[1][0]][box[1][1] + 1] === '.') {
				return [[".", depth]];
			}
			if (map[box[1][0]][box[1][1] + 1] === '#') {
				return [["#", depth]];
			}
			if (map[box[1][0]][box[1][1] + 1] === '[') {
				const next_box = [[x1, y1 + 2], [x2, y2 + 2]] as BoxPos;
				return [[next_box, depth], ...neighbours(map, next_box, dir, depth + 1)];
			}
		}
		case '<': {
			if (map[box[0][0]][box[0][1] - 1] === '.') {
				return [[".", depth]];
			}
			if (map[box[0][0]][box[0][1] - 1] === '#') {
				return [["#", depth]];
			}
			if (map[box[0][0]][box[0][1] - 1] === ']') {
				const next_box = [[x1, y1 - 2], [x2, y2 - 2]] as BoxPos;
				return [[next_box, depth], ...neighbours(map, next_box, dir, depth + 1)];
			}
		}
		case '^': {
			if (map[box[0][0] - 1][box[0][1]] === '.' && map[box[1][0] - 1][box[1][1]] === '.') {
				return [[".", depth]];
			}
			// if at least one wall, return just the wall
			if (map[box[0][0] - 1][box[0][1]] === '#' || map[box[1][0] - 1][box[1][1]] === '#') {
				return [["#", depth]];
			}
			// one box above us
			if (map[box[0][0] - 1][box[0][1]] === '[') {
				const next_box = [[x1 - 1, y1], [x2 - 1, y2]] as BoxPos;
				return [[next_box, depth], ...neighbours(map, next_box, dir, depth + 1)];
			}
			// two boxes above us, check both sides
			if (map[box[0][0] - 1][box[0][1]] === ']' && map[box[1][0] - 1][box[1][1]] === '[') {
				const next_box = [[x1 - 1, y1 - 1], [x2 - 1, y2 - 1]] as BoxPos;
				const next_box2 = [[x1 - 1, y1 + 1], [x2 - 1, y2 + 1]] as BoxPos;
				return [[next_box, depth], [next_box2, depth], ...neighbours(map, next_box, dir, depth + 1), ...neighbours(map, next_box2, dir, depth + 1)];
			}
			// if only left box
			if (map[box[0][0] - 1][box[0][1]] === ']') {
				const next_box = [[x1 - 1, y1 - 1], [x2 - 1, y2 - 1]] as BoxPos;
				return [[next_box, depth], ...neighbours(map, next_box, dir, depth + 1)];
			}
			// if only right box
			if (map[box[1][0] - 1][box[1][1]] === '[') {
				const next_box = [[x1 - 1, y1 + 1], [x2 - 1, y2 + 1]] as BoxPos;
				return [[next_box, depth], ...neighbours(map, next_box, dir, depth + 1)];
			}
		}
		case 'v': {
			if (map[box[0][0] + 1][box[0][1]] === '.' && map[box[1][0] + 1][box[1][1]] === '.') {
				return [[".", depth]];
			}
			// if at least one wall, return just the wall
			if (map[box[0][0] + 1][box[0][1]] === '#' || map[box[1][0] + 1][box[1][1]] === '#') {
				return [["#", depth]];
			}
			// one box below us
			if (map[box[0][0] + 1][box[0][1]] === '[') {
				const next_box = [[x1 + 1, y1], [x2 + 1, y2]] as BoxPos;
				return [[next_box, depth], ...neighbours(map, next_box, dir, depth + 1)];
			}
			// two boxes below us, check both sides
			if (map[box[0][0] + 1][box[0][1]] === ']' && map[box[1][0] + 1][box[1][1]] === '[') {
				const next_box = [[x1 + 1, y1 - 1], [x2 + 1, y2 - 1]] as BoxPos;
				const next_box2 = [[x1 + 1, y1 + 1], [x2 + 1, y2 + 1]] as BoxPos;
				return [[next_box, depth], [next_box2, depth], ...neighbours(map, next_box, dir, depth + 1), ...neighbours(map, next_box2, dir, depth + 1)];
			}
			// if only left box
			if (map[box[0][0] + 1][box[0][1]] === ']') {
				const next_box = [[x1 + 1, y1 - 1], [x2 + 1, y2 - 1]] as BoxPos;
				return [[next_box, depth], ...neighbours(map, next_box, dir, depth + 1)];
			}
			// if only right box
			if (map[box[1][0] + 1][box[1][1]] === '[') {
				const next_box = [[x1 + 1, y1 + 1], [x2 + 1, y2 + 1]] as BoxPos;
				return [[next_box, depth], ...neighbours(map, next_box, dir, depth + 1)];
			}
		}

	}
	return [];
}
const map_expanded = ((map: string[][]): string[][] => map.map(row => row.map(c => {
	switch (c) {
		case '#': return ['#', '#'];
		case 'O': return ['[', ']'];
		case '.': return ['.', '.'];
		case '@': return ['@', '.'];
		default: throw new Error('Unknown character');
	}
}).flat()))(map);

printColorfulMap(map_expanded);

const move2 = (map: string[][], mvmt: string): string[][] => {
	// create map copy
	const map_copy = map.map(row => row.slice());
	// find robot
	const robot = map.reduce((acc, row, i) => {
		const j = row.indexOf('@');
		if (j !== -1) {
			acc = [i, j];
		}
		return acc;
	}, [-1, -1]);
	if (robot[0] === -1) {
		throw new Error('Robot not found');
	}

	const new_pos = [robot[0] + delta_dir[mvmt]![0], robot[1] + delta_dir[mvmt]![1]];
	console.log('new_pos:', new_pos);
	console.log('it is a: ', map_copy[new_pos[0]][new_pos[1]]);

	if (map_copy[new_pos[0]][new_pos[1]] === '#') {
		// hit the wall, no movement
		return map_copy;
	}
	if (map_copy[new_pos[0]][new_pos[1]] === '.') {
		// empty space, easy movement
		console.log('move robot to empty space');
		map_copy[new_pos[0]][new_pos[1]] = '@';
		map_copy[robot[0]][robot[1]] = '.';
		return map_copy;
	}
	// check for [ or ]
	if (map_copy[new_pos[0]]![new_pos[1]]! === '[' || map_copy[new_pos[0]]![new_pos[1]]! === ']') {
		// box position is
		const the_box = (map_copy[new_pos[0]]![new_pos[1]]! === '[') ? [[new_pos[0], new_pos[1]], [new_pos[0], new_pos[1] + 1]] as BoxPos : [[new_pos[0], new_pos[1] - 1], [new_pos[0], new_pos[1]]] as BoxPos;
		const ns = neighbours(map_copy, the_box, mvmt, 0).sort((a, b) => a[1] - b[1]).map(a => a[0]);
		const boxes = [the_box, ...ns];
		console.log('boxes to move', boxes);

		// if there is any wall, fail
		if (boxes.some(b => b === '#')) {
			return map;
		}

		// shift all boxes according to the movement
		for (let i = boxes.length - 1; i >= 0; i--) {
			if (boxes[i] === '.' || boxes[i] === '#') continue;

			const dDir = delta_dir[mvmt]!;
			const new_pos = [boxes[i][0][0] as number + dDir[0], boxes[i][0][1] as number + dDir[1]];
			console.log('moving', boxes[i], 'to', new_pos);
			map_copy[boxes[i][0][0] as number][boxes[i][0][1] as number] = '.';
			map_copy[boxes[i][1][0] as number][boxes[i][1][1] as number] = '.';
			map_copy[new_pos[0]][new_pos[1]] = '[';
			map_copy[new_pos[0]][new_pos[1] + 1] = ']';

		}
		// and move the robot
		map_copy[robot[0]][robot[1]] = '.';
		map_copy[new_pos[0]][new_pos[1]] = '@';
		return map_copy;
	}
	return map_copy;
}


const check_valid_map = (map: string[][]): boolean => {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] === '[') {
				if (map[i][j + 1] !== ']') {
					return false;
				}
			}
			if (map[i][j] === ']') {
				if (map[i][j - 1] !== '[') {
					return false;
				}
			}
		}
	}
	return true;
}

// let's move
let map_copy = map_expanded.map(row => row.slice());
for (const m of mvmt) {
	console.log('moving ', m);
	map_copy = move2(map_copy, m);
	printColorfulMap(map_copy);
	console.log('------------------');
	if (!check_valid_map(map_copy)) {
		console.log('invalid map');
		break;
	}
	//prompt("press enter to continue");
}

let sum2 = 0;
// count [ positions
for (let i = 0; i < map_copy.length; i++) {
	for (let j = 0; j < map_copy[i].length; j++) {
		if (map_copy[i][j] === '[') {
			sum2 += gps_pos([i, j]);
		}
	}
}
console.log('sum2:', sum2);
