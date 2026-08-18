import { describe, expect, it } from 'vitest';
import {
	CreateHistoryRecordFromState,
	GetBestRerollOption,
	GetCritStatus,
	GetFireDamageDicePool,
	GetForceDamageDicePool,
	GetHighestHitRoll,
	GetHighestHitValue,
	GetHitPreConfirmStatusColorClass,
	GetHitStatusColorClass,
	GetHitStatusText,
	GetPiercingDamageDicePool,
	RollHitDice,
} from './AttackSheetStateFunctions';
import { CritStatus } from '../GloomStalkerTypes';
import { buildTestState, testGloomStalkerInfo } from './test/fixtures';

describe('GetBestRerollOption', () => {
	it('returns null when no dice are rerollable', () => {
		const state = buildTestState({
			piercingDamageDicePool: [6],
			piercingDamageRolls: [6],
		});

		expect(GetBestRerollOption(state)).toBeNull();
	});

	it('picks the rerollable die with the lowest roll', () => {
		const state = buildTestState({
			piercingDamageDicePool: [8, 6],
			piercingDamageRolls: [1, 6],
		});

		expect(GetBestRerollOption(state)).toEqual({
			dieSize: 8,
			roll: 1,
			type: 'piercing',
			dicePoolIndex: 0,
		});
	});

	it('breaks ties on equal rolls by picking the larger die', () => {
		const state = buildTestState({
			piercingDamageDicePool: [6, 12],
			piercingDamageRolls: [1, 1],
		});

		expect(GetBestRerollOption(state)).toEqual({
			dieSize: 12,
			roll: 1,
			type: 'piercing',
			dicePoolIndex: 1,
		});
	});
});

describe('GetHighestHitRoll / GetCritStatus', () => {
	it('treats a 20 as a critical hit', () => {
		const state = buildTestState({ attackRolls: [5, 20, 12] });
		expect(GetHighestHitRoll(state)).toBe(20);
		expect(GetCritStatus(state)).toBe(CritStatus.CriticalHit);
	});

	it('treats a lone 1 as a critical miss', () => {
		const state = buildTestState({ attackRolls: [1] });
		expect(GetCritStatus(state)).toBe(CritStatus.CriticalMiss);
	});

	it('treats anything else as normal', () => {
		const state = buildTestState({ attackRolls: [10] });
		expect(GetCritStatus(state)).toBe(CritStatus.Normal);
	});
});

describe('GetHitStatusText', () => {
	it('prefixes Critical on a natural 20 or 1', () => {
		expect(GetHitStatusText(buildTestState({ attackRolls: [20], isHit: true }))).toBe('Critical Hit');
		expect(GetHitStatusText(buildTestState({ attackRolls: [1], isHit: false }))).toBe('Critical Miss');
	});

	it('reports plain Hit/Miss otherwise', () => {
		expect(GetHitStatusText(buildTestState({ attackRolls: [10], isHit: true }))).toBe('Hit');
		expect(GetHitStatusText(buildTestState({ attackRolls: [10], isHit: false }))).toBe('Miss');
	});
});

describe('GetHitStatusColorClass', () => {
	it('is blue on a natural 20 regardless of hit status', () => {
		expect(GetHitStatusColorClass(buildTestState({ attackRolls: [20], isHit: false }))).toBe('text-blue-500');
	});

	it('is green on a hit and red on a miss otherwise', () => {
		expect(GetHitStatusColorClass(buildTestState({ attackRolls: [10], isHit: true }))).toBe('text-green-500');
		expect(GetHitStatusColorClass(buildTestState({ attackRolls: [10], isHit: false }))).toBe('text-red-500');
	});
});

describe('GetHitPreConfirmStatusColorClass', () => {
	it('is blue on 20, red on 1, green otherwise', () => {
		expect(GetHitPreConfirmStatusColorClass(buildTestState({ attackRolls: [20] }))).toBe('text-blue-500');
		expect(GetHitPreConfirmStatusColorClass(buildTestState({ attackRolls: [1] }))).toBe('text-red-500');
		expect(GetHitPreConfirmStatusColorClass(buildTestState({ attackRolls: [10] }))).toBe('text-green-500');
	});
});

describe('GetHighestHitValue', () => {
	it('adds the attack modifier to the highest roll', () => {
		const state = buildTestState({ attackRolls: [12] });
		expect(GetHighestHitValue(state)).toBe(12 + testGloomStalkerInfo.attackModifier);
	});

	it('applies the sharpshooter -5 penalty when set', () => {
		const state = buildTestState({ attackRolls: [12], applySharpShooterPenalty: true });
		expect(GetHighestHitValue(state)).toBe(12 + testGloomStalkerInfo.attackModifier - 5);
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
		const state = buildTestState({ attackRolls: [10] });
		expect(GetPiercingDamageDicePool(state)).toEqual([8]);
	});

	it('adds a second weapon die for a Dread Ambusher extra attack', () => {
		const state = buildTestState({ attackRolls: [10], isDreadAmbusherExtraAttack: true });
		expect(GetPiercingDamageDicePool(state)).toEqual([8, 8]);
	});

	it("is unaffected by Hunter's Mark (now Force damage)", () => {
		const state = buildTestState({ attackRolls: [10], applyHuntersMark: true });
		expect(GetPiercingDamageDicePool(state)).toEqual([8]);
	});

	it('doubles the pool and adds one more weapon die on a critical hit', () => {
		const state = buildTestState({ attackRolls: [20] });
		expect(GetPiercingDamageDicePool(state)).toEqual([8, 8, 8]);
	});

	it('combines Dread Ambusher and a crit', () => {
		const state = buildTestState({
			attackRolls: [20],
			isDreadAmbusherExtraAttack: true,
		});
		expect(GetPiercingDamageDicePool(state)).toEqual([8, 8, 8, 8, 8]);
	});
});

describe('GetForceDamageDicePool', () => {
	it("returns an empty pool when Hunter's Mark is not applied", () => {
		const state = buildTestState({ attackRolls: [10] });
		expect(GetForceDamageDicePool(state)).toEqual([]);
	});

	it("adds a d6 when Hunter's Mark is applied", () => {
		const state = buildTestState({ attackRolls: [10], applyHuntersMark: true });
		expect(GetForceDamageDicePool(state)).toEqual([6]);
	});

	it('doubles the pool on a critical hit', () => {
		const state = buildTestState({ attackRolls: [20], applyHuntersMark: true });
		expect(GetForceDamageDicePool(state)).toEqual([6, 6]);
	});
});

describe('GetFireDamageDicePool', () => {
	it('starts with a single d6', () => {
		const state = buildTestState({ attackRolls: [10] });
		expect(GetFireDamageDicePool(state)).toEqual([6]);
	});

	it('doubles the pool on a critical hit', () => {
		const state = buildTestState({ attackRolls: [20] });
		expect(GetFireDamageDicePool(state)).toEqual([6, 6]);
	});
});

describe('CreateHistoryRecordFromState', () => {
	it('uses the injected clock for the timestamp', () => {
		const state = buildTestState();
		const record = CreateHistoryRecordFromState(state, () => 12345);
		expect(record.timestamp).toBe(12345);
	});

	it('shallow-copies gloomStalkerInfo so mutating the record does not mutate the source state', () => {
		const state = buildTestState();
		const record = CreateHistoryRecordFromState(state, () => 0);

		record.gloomStalkerInfo.attackModifier = 999;

		expect(state.gloomStalkerInfo.attackModifier).toBe(testGloomStalkerInfo.attackModifier);
	});
});
