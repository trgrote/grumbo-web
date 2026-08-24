import { describe, expect, it } from 'vitest';
import { AttackStep } from '../GloomStalkerTypes';
import { buildTestCharacterState, buildTestModel, testGloomStalkerInfo } from './test/fixtures';

describe('GloomStalkerAttackModel', () => {
	describe('steps', () => {
		it('walks all five steps of the Gloom Stalker flow', () => {
			expect(buildTestModel().steps).toEqual([
				AttackStep.PreAttackRoll,
				AttackStep.PostAttackRoll,
				AttackStep.PreDamageRoll,
				AttackStep.PostDamageRoll,
				AttackStep.Results,
			]);
		});
	});

	describe('createInitialCharacterState', () => {
		it('builds default state from the info it was constructed with', () => {
			const result = buildTestModel({ ...testGloomStalkerInfo, attackModifier: 99 }).createInitialCharacterState();

			expect(result.gloomStalkerInfo.attackModifier).toBe(99);
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

		it('rolls three d20s (elven accuracy) with advantage', () => {
			const characterState = buildTestCharacterState({ hasAdvantage: true });
			const result = buildTestModel().rollForAttack(characterState, () => 0.999);

			expect(result.attackRolls).toEqual([20, 20, 20]);
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
		it('builds the dice pools, rolls them, and clears the used reroll', () => {
			const characterState = buildTestCharacterState({ attackRolls: [10], hasUsedReroll: true });
			const result = buildTestModel().rollForDamage(characterState, () => 0.5);

			expect(result.piercingDamageDicePool).toEqual([8]);
			expect(result.piercingDamageRolls).toEqual([5]);
			expect(result.fireDamageDicePool).toEqual([6]);
			expect(result.fireDamageRolls).toEqual([4]);
			expect(result.forceDamageDicePool).toEqual([]);
			expect(result.forceDamageRolls).toEqual([]);
			expect(result.hasUsedReroll).toBe(false);
		});

		it('doubles the pools on a critical hit', () => {
			const characterState = buildTestCharacterState({ attackRolls: [20] });
			const result = buildTestModel().rollForDamage(characterState, () => 0);

			expect(result.piercingDamageDicePool).toEqual([8, 8, 8]);
			expect(result.fireDamageDicePool).toEqual([6, 6]);
		});

		it("builds and rolls the force pool when Hunter's Mark is applied", () => {
			const characterState = buildTestCharacterState({ attackRolls: [10], applyHuntersMark: true });
			const result = buildTestModel().rollForDamage(characterState, () => 0.5);

			expect(result.forceDamageDicePool).toEqual([6]);
			expect(result.forceDamageRolls).toEqual([4]);
		});
	});

	describe('onStepReverted', () => {
		it('clears the attack roll and hit flag when leaving PostAttackRoll', () => {
			const characterState = buildTestCharacterState({ attackRolls: [15], isHit: true });
			const result = buildTestModel().onStepReverted(characterState, AttackStep.PostAttackRoll);

			expect(result.attackRolls).toEqual([]);
			expect(result.isHit).toBe(false);
		});

		it('clears the damage pools and rolls when leaving PostDamageRoll', () => {
			const characterState = buildTestCharacterState({
				piercingDamageDicePool: [8],
				piercingDamageRolls: [5],
				fireDamageDicePool: [6],
				fireDamageRolls: [3],
				forceDamageDicePool: [6],
				forceDamageRolls: [2],
			});
			const result = buildTestModel().onStepReverted(characterState, AttackStep.PostDamageRoll);

			expect(result.piercingDamageDicePool).toEqual([]);
			expect(result.piercingDamageRolls).toEqual([]);
			expect(result.fireDamageDicePool).toEqual([]);
			expect(result.fireDamageRolls).toEqual([]);
			expect(result.forceDamageDicePool).toEqual([]);
			expect(result.forceDamageRolls).toEqual([]);
		});

		it('clears nothing when leaving PreDamageRoll', () => {
			const characterState = buildTestCharacterState({ attackRolls: [15], isHit: true });
			const result = buildTestModel().onStepReverted(characterState, AttackStep.PreDamageRoll);

			expect(result).toBe(characterState);
		});
	});
});
