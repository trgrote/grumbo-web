import { describe, expect, it } from 'vitest';
import { AttackStep } from '../PaladinTypes';
import { buildTestCharacterState, buildTestModel, testPaladinInfo } from './test/fixtures';

describe('PaladinAttackModel', () => {
	describe('steps', () => {
		it('walks the four steps of the Paladin flow, with no PostDamageRoll', () => {
			expect(buildTestModel().steps).toEqual([
				AttackStep.PreAttackRoll,
				AttackStep.PostAttackRoll,
				AttackStep.PreDamageRoll,
				AttackStep.Results,
			]);
		});
	});

	describe('createInitialCharacterState', () => {
		it('builds default state from the info it was constructed with', () => {
			const result = buildTestModel({ ...testPaladinInfo, attackModifier: 99 }).createInitialCharacterState();

			expect(result.paladinInfo.attackModifier).toBe(99);
			expect(result.attackRolls).toEqual([]);
			expect(result.hasAdvantage).toBe(false);
		});
	});

	describe('rollForAttack', () => {
		it('rolls a single d20 without advantage', () => {
			const characterState = buildTestCharacterState({ hasAdvantage: false });
			const result = buildTestModel().rollForAttack(characterState, () => 0);

			expect(result.attackRolls).toEqual([1]);
		});

		it('rolls two d20s with advantage', () => {
			const characterState = buildTestCharacterState({ hasAdvantage: true });
			const result = buildTestModel().rollForAttack(characterState, () => 0.999);

			expect(result.attackRolls).toEqual([20, 20]);
		});
	});

	describe('setIsHit', () => {
		it('sets the hit flag either way', () => {
			const model = buildTestModel();

			expect(model.setIsHit(buildTestCharacterState(), true).isHit).toBe(true);
			expect(model.setIsHit(buildTestCharacterState({ isHit: true }), false).isHit).toBe(false);
		});
	});

	describe('rollForDamage', () => {
		it('rolls a single weapon damage die on a non-crit', () => {
			const characterState = buildTestCharacterState({ attackRolls: [10] });
			const result = buildTestModel().rollForDamage(characterState, () => 0.5);

			expect(result.weaponDamageRolls).toEqual([5]);
			expect(result.divineSmiteDamageRolls).toEqual([]);
		});

		it('doubles the weapon damage pool on a critical hit', () => {
			const characterState = buildTestCharacterState({ attackRolls: [20] });
			const result = buildTestModel().rollForDamage(characterState, () => 0.5);

			expect(result.weaponDamageRolls).toEqual([5, 5]);
		});

		it('stacks the divine smite formula: improved DS, fiend/undead target and spell slot, doubled on a crit', () => {
			const characterState = buildTestCharacterState({
				attackRolls: [20],
				isTargetFiendOrUndead: true,
				spellSlotUsed: 2,
				paladinInfo: { ...testPaladinInfo, hasImprovedDS: true },
			});
			const result = buildTestModel().rollForDamage(characterState, () => 0);

			// (1 improved DS + 1 fiend/undead + 3 for spell slot 2) * 2 for crit = 10
			expect(result.divineSmiteDamageRolls).toHaveLength(10);
		});
	});

	describe('onStepReverted', () => {
		it('clears the attack roll and hit flag when leaving PostAttackRoll', () => {
			const characterState = buildTestCharacterState({ attackRolls: [15], isHit: true });
			const result = buildTestModel().onStepReverted(characterState, AttackStep.PostAttackRoll);

			expect(result.attackRolls).toEqual([]);
			expect(result.isHit).toBe(false);
		});

		it('clears nothing when leaving PreDamageRoll', () => {
			const characterState = buildTestCharacterState({ attackRolls: [15], isHit: true });
			const result = buildTestModel().onStepReverted(characterState, AttackStep.PreDamageRoll);

			expect(result).toBe(characterState);
		});
	});
});
