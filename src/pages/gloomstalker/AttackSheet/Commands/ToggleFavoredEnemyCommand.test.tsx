import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import ToggleFavoredEnemyCommand from './ToggleFavoredEnemyCommand';

describe('ToggleFavoredEnemyCommand', () => {
	it('adds the name to selectedFavoredEnemies when not already selected', () => {
		const state = buildTestState({ selectedFavoredEnemies: ['Goblin'] });

		expect(new ToggleFavoredEnemyCommand('Giant').apply(state).characterState.selectedFavoredEnemies).toEqual(['Goblin', 'Giant']);
	});

	it('removes the name from selectedFavoredEnemies when already selected', () => {
		const state = buildTestState({ selectedFavoredEnemies: ['Goblin', 'Giant'] });

		expect(new ToggleFavoredEnemyCommand('Giant').apply(state).characterState.selectedFavoredEnemies).toEqual(['Goblin']);
	});
});
