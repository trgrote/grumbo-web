import { describe, expect, it } from 'vitest';
import {
	CreateHistoryRecordFromState,
	FormatDieRolls,
	FormatHitValueBreakdown,
	GetBestRerollOption,
	GetCritStatus,
	GetFireDamageDicePool,
	GetForceDamageDicePool,
	GetHighestHitRoll,
	GetFavoredEnemyBonus,
	GetHighestHitValue,
	GetHitPreConfirmStatusColorClass,
	GetHitStatusColorClass,
	GetHitStatusText,
	GetIsAlreadyBestRolls,
	GetPiercingDamageDicePool,
	GetRerollButtonText,
	GetTotalDamage,
	GetTotalFireDamage,
	GetTotalForceDamage,
	GetTotalPiercingDamage,
	RollHitDice,
} from './AttackSheetStateFunctions';
import { AttackStep, CritStatus, DamageType } from '../GloomStalkerTypes';
import { buildTestCharacterState, buildTestState, testGloomStalkerInfo } from './test/fixtures';

describe('GetBestRerollOption', () => {
	it('returns null when no dice are rerollable', () => {
		const state = buildTestCharacterState({
			piercingDamageDicePool: [6],
			piercingDamageRolls: [6],
		});

		expect(GetBestRerollOption(state)).toBeNull();
	});

	it('picks the rerollable die with the lowest roll', () => {
		const state = buildTestCharacterState({
			piercingDamageDicePool: [8, 6],
			piercingDamageRolls: [1, 6],
		});

		expect(GetBestRerollOption(state)).toEqual({
			dieSize: 8,
			roll: 1,
			type: DamageType.Piercing,
			dicePoolIndex: 0,
		});
	});

	it('breaks ties on equal rolls by picking the larger die', () => {
		const state = buildTestCharacterState({
			piercingDamageDicePool: [6, 12],
			piercingDamageRolls: [1, 1],
		});

		expect(GetBestRerollOption(state)).toEqual({
			dieSize: 12,
			roll: 1,
			type: DamageType.Piercing,
			dicePoolIndex: 1,
		});
	});
});

describe('FormatDieRolls', () => {
	it('zips rolls and dice into a d{size}->{roll} string', () => {
		expect(FormatDieRolls([6, 3], [8, 8])).toBe('d8->6, d8->3');
	});

	it('formats an empty pool', () => {
		expect(FormatDieRolls([], [])).toBe('');
	});
});

describe('GetIsAlreadyBestRolls / GetRerollButtonText', () => {
	it('reports "Reroll Used" once a reroll has been used', () => {
		const state = buildTestCharacterState({
			piercingDamageDicePool: [8],
			piercingDamageRolls: [1],
			hasUsedReroll: true,
		});
		expect(GetRerollButtonText(state)).toBe('Reroll Used');
		expect(GetIsAlreadyBestRolls(state)).toBe(false);
	});

	it('offers the best rerollable die when one exists', () => {
		const state = buildTestCharacterState({
			piercingDamageDicePool: [8],
			piercingDamageRolls: [1],
			hasUsedReroll: false,
		});
		expect(GetRerollButtonText(state)).toBe('Reroll Lowest Damage Roll? (d8->1)');
		expect(GetIsAlreadyBestRolls(state)).toBe(false);
	});

	it('reports "Already best rolls!" when every die is maxed', () => {
		const state = buildTestCharacterState({
			piercingDamageDicePool: [8],
			piercingDamageRolls: [8],
			hasUsedReroll: false,
		});
		expect(GetRerollButtonText(state)).toBe('Already best rolls!');
		expect(GetIsAlreadyBestRolls(state)).toBe(true);
	});
});

describe('GetHighestHitRoll / GetCritStatus', () => {
	it('treats a 20 as a critical hit', () => {
		const state = buildTestCharacterState({ attackRolls: [5, 20, 12] });
		expect(GetHighestHitRoll(state)).toBe(20);
		expect(GetCritStatus(state)).toBe(CritStatus.CriticalHit);
	});

	it('treats a lone 1 as a critical miss', () => {
		const state = buildTestCharacterState({ attackRolls: [1] });
		expect(GetCritStatus(state)).toBe(CritStatus.CriticalMiss);
	});

	it('treats anything else as normal', () => {
		const state = buildTestCharacterState({ attackRolls: [10] });
		expect(GetCritStatus(state)).toBe(CritStatus.Normal);
	});
});

describe('GetHitStatusText', () => {
	it('prefixes Critical on a natural 20 or 1', () => {
		expect(GetHitStatusText(buildTestCharacterState({ attackRolls: [20], isHit: true }))).toBe('Critical Hit');
		expect(GetHitStatusText(buildTestCharacterState({ attackRolls: [1], isHit: false }))).toBe('Critical Miss');
	});

	it('reports plain Hit/Miss otherwise', () => {
		expect(GetHitStatusText(buildTestCharacterState({ attackRolls: [10], isHit: true }))).toBe('Hit');
		expect(GetHitStatusText(buildTestCharacterState({ attackRolls: [10], isHit: false }))).toBe('Miss');
	});
});

describe('GetHitStatusColorClass', () => {
	it('is blue on a natural 20 regardless of hit status', () => {
		expect(GetHitStatusColorClass(buildTestCharacterState({ attackRolls: [20], isHit: false }))).toBe('text-blue-500');
	});

	it('is green on a hit and red on a miss otherwise', () => {
		expect(GetHitStatusColorClass(buildTestCharacterState({ attackRolls: [10], isHit: true }))).toBe('text-green-500');
		expect(GetHitStatusColorClass(buildTestCharacterState({ attackRolls: [10], isHit: false }))).toBe('text-red-500');
	});
});

describe('GetHitPreConfirmStatusColorClass', () => {
	it('is blue on 20, red on 1, green otherwise', () => {
		expect(GetHitPreConfirmStatusColorClass(buildTestCharacterState({ attackRolls: [20] }))).toBe('text-blue-500');
		expect(GetHitPreConfirmStatusColorClass(buildTestCharacterState({ attackRolls: [1] }))).toBe('text-red-500');
		expect(GetHitPreConfirmStatusColorClass(buildTestCharacterState({ attackRolls: [10] }))).toBe('text-green-500');
	});
});

describe('GetHighestHitValue', () => {
	it('adds the attack modifier to the highest roll', () => {
		const state = buildTestCharacterState({ attackRolls: [12] });
		expect(GetHighestHitValue(state)).toBe(12 + testGloomStalkerInfo.attackModifier);
	});

	it('applies the sharpshooter -5 penalty when set', () => {
		const state = buildTestCharacterState({ attackRolls: [12], applySharpShooterPenalty: true });
		expect(GetHighestHitValue(state)).toBe(12 + testGloomStalkerInfo.attackModifier - 5);
	});

	it('adds +2 per selected favored enemy', () => {
		const state = buildTestCharacterState({ attackRolls: [12], selectedFavoredEnemies: ['Giant', 'Goblin'] });
		expect(GetHighestHitValue(state)).toBe(12 + testGloomStalkerInfo.attackModifier + 4);
	});
});

describe('GetFavoredEnemyBonus', () => {
	it('returns 0 when no favored enemies are selected', () => {
		const state = buildTestCharacterState({ selectedFavoredEnemies: [] });
		expect(GetFavoredEnemyBonus(state)).toBe(0);
	});

	it('returns +2 per selected favored enemy', () => {
		const state = buildTestCharacterState({ selectedFavoredEnemies: ['Giant', 'Goblin'] });
		expect(GetFavoredEnemyBonus(state)).toBe(4);
	});
});

describe('FormatHitValueBreakdown', () => {
	it('formats a plain hit with no penalty or bonus', () => {
		const state = buildTestCharacterState({ attackRolls: [12] });
		// 12 + attackModifier(5) = 17
		expect(FormatHitValueBreakdown(state)).toBe('17 (12 + 5)');
	});

	it('includes the sharpshooter penalty', () => {
		const state = buildTestCharacterState({ attackRolls: [12], applySharpShooterPenalty: true });
		// 12 + attackModifier(5) - 5 = 12
		expect(FormatHitValueBreakdown(state)).toBe('12 (12 + 5 - 5)');
	});

	it('includes the favored enemy bonus', () => {
		const state = buildTestCharacterState({ attackRolls: [12], selectedFavoredEnemies: ['Giant'] });
		// 12 + attackModifier(5) + favoredEnemyBonus(2) = 19
		expect(FormatHitValueBreakdown(state)).toBe('19 (12 + 5 + 2)');
	});

	it('combines the penalty and bonus together', () => {
		const state = buildTestCharacterState({
			attackRolls: [12],
			applySharpShooterPenalty: true,
			selectedFavoredEnemies: ['Giant'],
		});
		// 12 + attackModifier(5) - 5 + favoredEnemyBonus(2) = 14
		expect(FormatHitValueBreakdown(state)).toBe('14 (12 + 5 - 5 + 2)');
	});
});

describe('GetTotalPiercingDamage', () => {
	it('sums the piercing damage rolls and adds the damage modifier', () => {
		const state = buildTestCharacterState({ piercingDamageRolls: [4, 5] });
		// 4 + 5 + damageModifier(3)
		expect(GetTotalPiercingDamage(state)).toBe(12);
	});

	it('adds the Sharpshooter +10 bonus when the penalty is applied', () => {
		const state = buildTestCharacterState({ piercingDamageRolls: [4], applySharpShooterPenalty: true });
		// 4 + damageModifier(3) + sharpshooter(10)
		expect(GetTotalPiercingDamage(state)).toBe(17);
	});

	it('adds +2 per selected favored enemy', () => {
		const state = buildTestCharacterState({ piercingDamageRolls: [4], selectedFavoredEnemies: ['Giant', 'Goblin'] });
		// 4 + damageModifier(3) + favoredEnemyBonus(4)
		expect(GetTotalPiercingDamage(state)).toBe(11);
	});

	it('combines the damage modifier, Sharpshooter bonus, and favored enemy bonus together', () => {
		const state = buildTestCharacterState({
			piercingDamageRolls: [4, 5],
			applySharpShooterPenalty: true,
			selectedFavoredEnemies: ['Giant'],
		});
		// (4 + 5) + damageModifier(3) + sharpshooter(10) + favoredEnemyBonus(2)
		expect(GetTotalPiercingDamage(state)).toBe(24);
	});
});

describe('GetTotalFireDamage', () => {
	it('sums the fire damage rolls', () => {
		const state = buildTestCharacterState({ fireDamageRolls: [4, 5] });
		expect(GetTotalFireDamage(state)).toBe(9);
	});

	it('is 0 when there are no fire damage rolls', () => {
		const state = buildTestCharacterState({ fireDamageRolls: [] });
		expect(GetTotalFireDamage(state)).toBe(0);
	});
});

describe('GetTotalForceDamage', () => {
	it('sums the force damage rolls', () => {
		const state = buildTestCharacterState({ forceDamageRolls: [4, 5] });
		expect(GetTotalForceDamage(state)).toBe(9);
	});

	it('is 0 when there are no force damage rolls', () => {
		const state = buildTestCharacterState({ forceDamageRolls: [] });
		expect(GetTotalForceDamage(state)).toBe(0);
	});
});

describe('GetTotalDamage', () => {
	it('sums piercing, fire, and force damage together', () => {
		const state = buildTestCharacterState({
			piercingDamageRolls: [4],
			fireDamageRolls: [2],
			forceDamageRolls: [1],
		});
		// piercing(4 + damageModifier(3)) + fire(2) + force(1)
		expect(GetTotalDamage(state)).toBe(10);
	});

	it('includes the Sharpshooter and favored enemy bonuses via GetTotalPiercingDamage', () => {
		const state = buildTestCharacterState({
			piercingDamageRolls: [4],
			applySharpShooterPenalty: true,
			selectedFavoredEnemies: ['Giant'],
			fireDamageRolls: [2],
			forceDamageRolls: [1],
		});
		// piercing(4 + damageModifier(3) + sharpshooter(10) + favoredEnemyBonus(2)) + fire(2) + force(1)
		expect(GetTotalDamage(state)).toBe(22);
	});
});

describe('RollHitDice', () => {
	it('rolls a single die without advantage', () => {
		expect(RollHitDice(false, () => 0)).toEqual([1]);
	});

	it('rolls three dice with advantage (elven accuracy)', () => {
		expect(RollHitDice(true, () => 0)).toEqual([1, 1, 1]);
	});
});

describe('GetPiercingDamageDicePool', () => {
	it('starts with just the weapon damage die', () => {
		const state = buildTestCharacterState({ attackRolls: [10] });
		expect(GetPiercingDamageDicePool(state)).toEqual([8]);
	});

	it('adds a second weapon die for a Dread Ambusher extra attack', () => {
		const state = buildTestCharacterState({ attackRolls: [10], isDreadAmbusherExtraAttack: true });
		expect(GetPiercingDamageDicePool(state)).toEqual([8, 8]);
	});

	it("is unaffected by Hunter's Mark (now Force damage)", () => {
		const state = buildTestCharacterState({ attackRolls: [10], applyHuntersMark: true });
		expect(GetPiercingDamageDicePool(state)).toEqual([8]);
	});

	it('doubles the pool and adds one more weapon die on a critical hit', () => {
		const state = buildTestCharacterState({ attackRolls: [20] });
		expect(GetPiercingDamageDicePool(state)).toEqual([8, 8, 8]);
	});

	it('combines Dread Ambusher and a crit', () => {
		const state = buildTestCharacterState({
			attackRolls: [20],
			isDreadAmbusherExtraAttack: true,
		});
		expect(GetPiercingDamageDicePool(state)).toEqual([8, 8, 8, 8, 8]);
	});
});

describe('GetForceDamageDicePool', () => {
	it("returns an empty pool when Hunter's Mark is not applied", () => {
		const state = buildTestCharacterState({ attackRolls: [10] });
		expect(GetForceDamageDicePool(state)).toEqual([]);
	});

	it("adds a d6 when Hunter's Mark is applied", () => {
		const state = buildTestCharacterState({ attackRolls: [10], applyHuntersMark: true });
		expect(GetForceDamageDicePool(state)).toEqual([6]);
	});

	it('doubles the pool on a critical hit', () => {
		const state = buildTestCharacterState({ attackRolls: [20], applyHuntersMark: true });
		expect(GetForceDamageDicePool(state)).toEqual([6, 6]);
	});
});

describe('GetFireDamageDicePool', () => {
	it('starts with a single d6', () => {
		const state = buildTestCharacterState({ attackRolls: [10] });
		expect(GetFireDamageDicePool(state)).toEqual([6]);
	});

	it('doubles the pool on a critical hit', () => {
		const state = buildTestCharacterState({ attackRolls: [20] });
		expect(GetFireDamageDicePool(state)).toEqual([6, 6]);
	});
});

describe('CreateHistoryRecordFromState', () => {
	it('uses the injected clock for the timestamp', () => {
		const state = buildTestState();
		const record = CreateHistoryRecordFromState(state, () => 12345);
		expect(record.timestamp).toBe(12345);
	});

	it('flattens the character slice and the attack step into one record', () => {
		const state = buildTestState({ attackStep: AttackStep.Results, attackRolls: [20], isHit: true });
		const record = CreateHistoryRecordFromState(state, () => 0);

		expect(record.attackStep).toBe(AttackStep.Results);
		expect(record.attackRolls).toEqual([20]);
		expect(record.isHit).toBe(true);
	});

	it('shallow-copies gloomStalkerInfo so mutating the record does not mutate the source state', () => {
		const state = buildTestState();
		const record = CreateHistoryRecordFromState(state, () => 0);

		record.gloomStalkerInfo.attackModifier = 999;

		expect(state.characterState.gloomStalkerInfo.attackModifier).toBe(testGloomStalkerInfo.attackModifier);
	});
});
