export function RollDie(sides: number, rng: () => number = Math.random): number {
	return Math.floor(rng() * sides) + 1;
}

export function RollDice(dicePool: number[], rng: () => number = Math.random): number[] {
	return dicePool.map(sides => RollDie(sides, rng));
}
