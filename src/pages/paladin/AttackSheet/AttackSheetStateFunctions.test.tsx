import { describe, expect, it } from 'vitest';
import {
	CreateHistoryRecordFromState,
	GetCritStatus,
	GetDivineSmiteDamageDicePool,
	GetHighestAttackRoll,
	GetHighestAttackValue,
	GetHitPreConfirmStatusColorClass,
	GetHitStatusColorClass,
	GetHitStatusText,
	GetIsCritical,
	GetTotalDamage,
	GetTotalDivineSmiteDamage,
	GetTotalWeaponDamage,
	GetWeaponDamageDicePool,
	RollAttackDice,
	SpellSlotToString,
} from './AttackSheetStateFunctions';
import { buildTestState, testPaladinInfo } from './test/fixtures';
import { CritStatus } from '../PaladinTypes';

describe('GetHighestAttackRoll / GetIsCritical', () => {
	it('treats a 20 as a critical hit', () => {
		const state = buildTestState({ attackRolls: [5, 20, 12] });
		expect(GetHighestAttackRoll(state)).toBe(20);
		expect(GetIsCritical(state)).toBe(true);
	});

	it('treats anything else as not critical, including a lone 1', () => {
		expect(GetIsCritical(buildTestState({ attackRolls: [1] }))).toBe(false);
		expect(GetIsCritical(buildTestState({ attackRolls: [10] }))).toBe(false);
	});
});

describe('GetCritStatus', () => {
	it('reports a critical hit on a natural 20', () => {
		expect(GetCritStatus(buildTestState({ attackRolls: [5, 20] }))).toBe(CritStatus.CriticalHit);
	});

	it('reports a critical miss on a natural 1', () => {
		expect(GetCritStatus(buildTestState({ attackRolls: [1] }))).toBe(CritStatus.CriticalMiss);
	});

	it('reports Normal for anything in between', () => {
		expect(GetCritStatus(buildTestState({ attackRolls: [10] }))).toBe(CritStatus.Normal);
	});

	it('only considers the highest roll, so advantage can rescue a 1', () => {
		expect(GetCritStatus(buildTestState({ attackRolls: [1, 10] }))).toBe(CritStatus.Normal);
	});
});

describe('GetHighestAttackValue', () => {
	it('adds the attack modifier to the highest roll', () => {
		const state = buildTestState({ attackRolls: [12] });
		expect(GetHighestAttackValue(state)).toBe(12 + testPaladinInfo.attackModifier);
	});
});

describe('GetHitStatusText', () => {
	it('prefixes Critical on a natural 20 and a natural 1', () => {
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
	it('is blue on 20, red on a critical miss, green otherwise', () => {
		expect(GetHitPreConfirmStatusColorClass(buildTestState({ attackRolls: [20] }))).toBe('text-blue-500');
		expect(GetHitPreConfirmStatusColorClass(buildTestState({ attackRolls: [1] }))).toBe('text-red-500');
		expect(GetHitPreConfirmStatusColorClass(buildTestState({ attackRolls: [10] }))).toBe('text-green-500');
	});

	it('ignores a 1 that advantage has already beaten', () => {
		expect(GetHitPreConfirmStatusColorClass(buildTestState({ attackRolls: [1, 10] }))).toBe('text-green-500');
	});
});

describe('RollAttackDice', () => {
	it('rolls a single die without advantage', () => {
		expect(RollAttackDice(false, () => 0)).toEqual([1]);
	});

	it('rolls two dice with advantage', () => {
		expect(RollAttackDice(true, () => 0.999)).toEqual([20, 20]);
	});
});

describe('GetWeaponDamageDicePool', () => {
	it('is a single weapon die on a non-crit', () => {
		const state = buildTestState({ attackRolls: [10] });
		expect(GetWeaponDamageDicePool(state)).toEqual([8]);
	});

	it('doubles on a critical hit', () => {
		const state = buildTestState({ attackRolls: [20] });
		expect(GetWeaponDamageDicePool(state)).toEqual([8, 8]);
	});
});

describe('GetDivineSmiteDamageDicePool', () => {
	it('is empty with no bonuses and no spell slot used', () => {
		const state = buildTestState({ attackRolls: [10] });
		expect(GetDivineSmiteDamageDicePool(state)).toEqual([]);
	});

	it('adds a d8 for improved divine smite', () => {
		const state = buildTestState({
			attackRolls: [10],
			paladinInfo: { ...testPaladinInfo, hasImprovedDS: true },
		});
		expect(GetDivineSmiteDamageDicePool(state)).toEqual([8]);
	});

	it('adds a d8 for a fiend/undead target', () => {
		const state = buildTestState({ attackRolls: [10], isTargetFiendOrUndead: true });
		expect(GetDivineSmiteDamageDicePool(state)).toEqual([8]);
	});

	it('adds spellSlotUsed + 1 d8s when a spell slot is used', () => {
		const state = buildTestState({ attackRolls: [10], spellSlotUsed: 2 });
		expect(GetDivineSmiteDamageDicePool(state)).toEqual([8, 8, 8]);
	});

	it('combines all bonuses and doubles the pool on a critical hit', () => {
		const state = buildTestState({
			attackRolls: [20],
			isTargetFiendOrUndead: true,
			spellSlotUsed: 2,
			paladinInfo: { ...testPaladinInfo, hasImprovedDS: true },
		});
		// (1 improved DS + 1 fiend/undead + 3 for spell slot 2) * 2 for crit = 10
		expect(GetDivineSmiteDamageDicePool(state)).toHaveLength(10);
	});
});

describe('GetTotalWeaponDamage / GetTotalDivineSmiteDamage / GetTotalDamage', () => {
	it('sums weapon rolls plus the damage modifier', () => {
		const state = buildTestState({ weaponDamageRolls: [4, 5] });
		expect(GetTotalWeaponDamage(state)).toBe(4 + 5 + testPaladinInfo.damageModifier);
	});

	it('sums divine smite rolls with no modifier', () => {
		const state = buildTestState({ divineSmiteDamageRolls: [6, 7] });
		expect(GetTotalDivineSmiteDamage(state)).toBe(13);
	});

	it('adds weapon and divine smite totals together', () => {
		const state = buildTestState({ weaponDamageRolls: [4], divineSmiteDamageRolls: [6] });
		expect(GetTotalDamage(state)).toBe(4 + testPaladinInfo.damageModifier + 6);
	});
});

describe('SpellSlotToString', () => {
	it('reports None for 0 or below', () => {
		expect(SpellSlotToString(0)).toBe('None');
		expect(SpellSlotToString(-1)).toBe('None');
	});

	it('reports the slot number for 1-3', () => {
		expect(SpellSlotToString(1)).toBe('1');
		expect(SpellSlotToString(3)).toBe('3');
	});

	it('reports 4+ for 4 and above', () => {
		expect(SpellSlotToString(4)).toBe('4+');
		expect(SpellSlotToString(9)).toBe('4+');
	});
});

describe('CreateHistoryRecordFromState', () => {
	it('uses the injected clock for the timestamp', () => {
		const state = buildTestState();
		const record = CreateHistoryRecordFromState(state, () => 12345);
		expect(record.timestamp).toBe(12345);
	});

	it('shallow-copies paladinInfo so mutating the record does not mutate the source state', () => {
		const state = buildTestState();
		const record = CreateHistoryRecordFromState(state, () => 0);

		record.paladinInfo.attackModifier = 999;

		expect(state.paladinInfo.attackModifier).toBe(testPaladinInfo.attackModifier);
	});
});
