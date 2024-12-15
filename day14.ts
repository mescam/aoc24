// fucking robots again
import input from './resources/day14_input.txt' with {type: 'text'};
import * as fs from 'fs';
// change for real data
const max_width = 101;
const max_height = 103;

type Robot = {
	x: number;
	y: number;
	vX: number;
	vY: number;
};

const robots = ((input: string): Robot[] =>
	input.trim().split('\n').map((line) => {
		const [_, x, y, vX, vY] = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!.map(Number);
		return { x, y, vX, vY } as Robot;
	}))(input);


const tick = (robot: Robot): Robot => {
	let newX = (robot.x + robot.vX) % max_width;
	if (newX < 0) { newX += max_width; }
	let newY = (robot.y + robot.vY) % max_height;
	if (newY < 0) { newY += max_height };

	return { ...robot, x: newX, y: newY };
}

const after100ticks = robots.map(robot => [...Array(100)].reduce(tick, robot));


// To determine the safest area, count the number of robots in each quadrant after 100 seconds. Robots that are exactly in the middle (horizontally or vertically) don't count as being in any quadrant

const quadrant = (x: number, y: number): number => {
	const halfWidth: number = Math.floor(max_width / 2);
	const halfHeight: number = Math.floor(max_height / 2);

	if (x === halfWidth || y === halfHeight) {
		return -1;
	}

	const lx = (x < halfWidth) ? 0b10 : 0b00;
	const ly = (y < halfHeight) ? 0b01 : 0b00;

	return lx | ly;
}


const robotsInQuadrants = (rs: Robot[]) => rs.reduce((acc, robot) => {
	const q = quadrant(robot.x, robot.y);
	if (q === -1) {
		return acc;
	}
	acc[q]++;
	return acc;
}, [0, 0, 0, 0]).reduce((acc: number, n: number) => acc * n, 1);

//console.log(robotsInQuadrants);

const robots2Grid = (robots: Robot[]): number[][] => {
	// start with full zero grid
	const grid = Array.from({ length: max_height }, () => Array.from({ length: max_width }, () => 0));
	robots.forEach(({ x, y }) => {
		grid[y][x] += 1;
	});
	return grid;
}

const visualize = (robots: Robot[]) => {
	let bitmap = "P1\n" + max_width + " " + max_height + "\n";
	const grid = robots2Grid(robots);
	grid.forEach((row) => {
		row.forEach((cell) => {
			bitmap += cell > 0 ? "1" : "0";
		});
		bitmap += "\n";
	});
	return bitmap;
}

const save2File = (filename: string, content: string) =>
	fs.writeFileSync(filename, content);


// generate 10000 ticks robots[] map
const all_robots = [robots];
for (let i = 0; i < 10000; i++) {
	all_robots.push(all_robots[i].map(robot => tick(robot)));
}

const rank = all_robots.map((rs, i) => [i, robotsInQuadrants(rs), rs]).sort((a, b) => a[1] - b[1]).splice(0, 100);

console.log(rank[0][0]);
console.log(visualize(rank[0][2]));
