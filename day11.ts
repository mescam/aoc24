//const input = "125 17";
import input from "./resources/day11_input.txt" with {type: 'text'};


const stones: number[] = input.trim().split(' ').map(Number);
const blink = (stone: number) => {
	// if stone is 0
	if (stone === 0) return [1];
	// if stone has even number of digits, split the number in half ( 1234 -> 12, 34)
	if (Math.floor(Math.log10(stone) + 1) % 2 === 0) {
		const stone_str = stone.toString();
		const half = Math.floor(stone_str.length / 2);
		return [Number(stone_str.slice(0, half)), Number(stone_str.slice(half))];
	}
	return [stone * 2024];
}

const memo: { [key: string]: number } = {};

const all_blinks = (stone: number, b: number): number => {
	if (memo[stone + ' ' + b]) return memo[stone + ' ' + b];
	if (b == 75)
		return 1;
	else {
		const result = blink(stone).reduce((acc, val) => acc + all_blinks(val, b + 1), 0);
		memo[stone + ' ' + b] = result;
		return result;
	}
}

const max_stones = stones.reduce((acc, stone) => acc + all_blinks(stone, 0), 0);


console.log('part 1', max_stones);

