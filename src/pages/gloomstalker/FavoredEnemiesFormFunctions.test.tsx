import { describe, expect, it } from 'vitest';
import { AddFavoredEnemy, RemoveFavoredEnemy } from './FavoredEnemiesFormFunctions';

describe('AddFavoredEnemy', () => {
	it('adds a trimmed name to the list and reports added: true', () => {
		expect(AddFavoredEnemy(['Giant'], '  Goblin  ')).toEqual({ favoredEnemies: ['Giant', 'Goblin'], added: true });
	});

	it('returns added: false and the list unchanged for an empty (or whitespace-only) name', () => {
		expect(AddFavoredEnemy(['Giant'], '')).toEqual({ favoredEnemies: ['Giant'], added: false });
		expect(AddFavoredEnemy(['Giant'], '   ')).toEqual({ favoredEnemies: ['Giant'], added: false });
	});

	it('returns added: false and the list unchanged for an exact duplicate', () => {
		expect(AddFavoredEnemy(['Giant'], 'Giant')).toEqual({ favoredEnemies: ['Giant'], added: false });
	});

	it('rejects a duplicate after trimming', () => {
		expect(AddFavoredEnemy(['Giant'], '  Giant  ')).toEqual({ favoredEnemies: ['Giant'], added: false });
	});

	it('adds to an empty list', () => {
		expect(AddFavoredEnemy([], 'Giant')).toEqual({ favoredEnemies: ['Giant'], added: true });
	});
});

describe('RemoveFavoredEnemy', () => {
	it('removes an existing entry', () => {
		expect(RemoveFavoredEnemy(['Giant', 'Goblin'], 'Giant')).toEqual(['Goblin']);
	});

	it('returns the list unchanged when the name is not present', () => {
		expect(RemoveFavoredEnemy(['Giant'], 'Goblin')).toEqual(['Giant']);
	});

	it('returns an empty list when removing the only entry', () => {
		expect(RemoveFavoredEnemy(['Giant'], 'Giant')).toEqual([]);
	});
});
