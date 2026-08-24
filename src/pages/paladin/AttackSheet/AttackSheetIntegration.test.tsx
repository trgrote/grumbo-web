import { describe, expect, it } from 'vitest';
import { CreateAttackSheetReducer } from '@/attackSheet/AttackSheetStateReducer';
import { CreateInitialState } from '@/attackSheet/AttackSheetStateFunctions';
import { AttackStep, PaladinAttackSheetState } from '../PaladinTypes';
import {
	AttackAgainCommand,
	ConfirmIsHitCommand,
	ConfirmIsMissCommand,
	GoBackCommand,
	IPalAttackSheetCommand,
	RollForAttackCommand,
	RollForDamageCommand,
	SetAdvantageCommand,
	SetIsTargetFiendOrUndeadCommand
} from './Commands/AttackSheetCommands';
import { CreateHistoryRecordFromState } from './AttackSheetStateFunctions';
import { buildTestModel } from './test/fixtures';

// Covers the seam the unit tests can't reach on their own: the shared flow commands
// bound to the Paladin's state, driven through the real reducer and model.
describe('Paladin attack sheet flow', () => {
	const model = buildTestModel();
	const reducer = CreateAttackSheetReducer(model);

	function run(commands: IPalAttackSheetCommand[], from = CreateInitialState(model)): PaladinAttackSheetState {
		return commands.reduce(reducer, from);
	}

	it('starts at PreAttackRoll with a fresh character state', () => {
		const state = CreateInitialState(model);

		expect(state.attackStep).toBe(AttackStep.PreAttackRoll);
		expect(state.characterState.attackRolls).toEqual([]);
		expect(state.characterState.hasAdvantage).toBe(false);
	});

	it('walks the full hit path from PreAttackRoll to Results', () => {
		const state = run([
			new SetAdvantageCommand(true),
			new RollForAttackCommand(() => 0),
			new ConfirmIsHitCommand(),
			new SetIsTargetFiendOrUndeadCommand(true),
			new RollForDamageCommand(() => 0),
		]);

		expect(state.attackStep).toBe(AttackStep.Results);
		expect(state.characterState.attackRolls).toEqual([1, 1]);   // 2d20 from advantage
		expect(state.characterState.isHit).toBe(true);
		expect(state.characterState.weaponDamageRolls).toEqual([1]);
		expect(state.characterState.divineSmiteDamageRolls).toEqual([1]);   // fiend/undead target
	});

	// Rolling damage from PreDamageRoll lands directly on Results, not a PostDamageRoll step
	// - the Paladin's flow deliberately omits it (see PaladinAttackModel.steps).
	it('rolling for damage from PreDamageRoll advances straight to Results', () => {
		const state = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsHitCommand(),
			new RollForDamageCommand(() => 0.5),
		]);

		expect(state.attackStep).toBe(AttackStep.Results);
	});

	it('short-circuits to Results on a miss, leaving damage unrolled', () => {
		const state = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsMissCommand(),
		]);

		expect(state.attackStep).toBe(AttackStep.Results);
		expect(state.characterState.isHit).toBe(false);
		expect(state.characterState.weaponDamageRolls).toEqual([]);
	});

	it('clears the attack roll but keeps pre-roll options when stepping back', () => {
		const state = run([
			new SetAdvantageCommand(true),
			new RollForAttackCommand(() => 0.5),
			new GoBackCommand(),
		]);

		expect(state.attackStep).toBe(AttackStep.PreAttackRoll);
		expect(state.characterState.attackRolls).toEqual([]);
		expect(state.characterState.isHit).toBe(false);
		expect(state.characterState.hasAdvantage).toBe(true);
	});

	it('keeps pre-damage options when stepping back from PreDamageRoll to PostAttackRoll', () => {
		const state = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsHitCommand(),
			new SetIsTargetFiendOrUndeadCommand(true),
			new GoBackCommand(),
		]);

		expect(state.attackStep).toBe(AttackStep.PostAttackRoll);
		expect(state.characterState.isTargetFiendOrUndead).toBe(true);
	});

	it('doubles the damage pools on a critical hit', () => {
		const state = run([
			new RollForAttackCommand(() => 0.999),   // nat 20
			new ConfirmIsHitCommand(),
			new RollForDamageCommand(() => 0.999),
		]);

		expect(state.characterState.attackRolls).toEqual([20]);
		expect(state.characterState.weaponDamageRolls).toEqual([8, 8]);
	});

	it('cannot step back out of Results', () => {
		const results = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsMissCommand(),
		]);

		expect(run([new GoBackCommand()], results)).toBe(results);
	});

	it('resets every Paladin option when attacking again', () => {
		const results = run([
			new SetAdvantageCommand(true),
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsHitCommand(),
			new SetIsTargetFiendOrUndeadCommand(true),
			new RollForDamageCommand(() => 0.5),
		]);

		const state = run([new AttackAgainCommand()], results);

		expect(state.attackStep).toBe(AttackStep.PreAttackRoll);
		expect(state.characterState.hasAdvantage).toBe(false);
		expect(state.characterState.isTargetFiendOrUndead).toBe(false);
		expect(state.characterState.attackRolls).toEqual([]);
		expect(state.characterState.weaponDamageRolls).toEqual([]);
		expect(state.characterState.isHit).toBe(false);
	});

	it('produces a flat history record matching the persisted shape', () => {
		const state = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsHitCommand(),
			new RollForDamageCommand(() => 0.5),
		]);

		const record = CreateHistoryRecordFromState(state, () => 12345);

		// Every key sits at the top level, exactly as pre-refactor records were stored.
		expect(record.timestamp).toBe(12345);
		expect(record.isHit).toBe(true);
		expect(record.attackRolls).toEqual(state.characterState.attackRolls);
		expect(record.paladinInfo).toEqual(state.characterState.paladinInfo);
		expect(record).not.toHaveProperty('characterState');
		// An enum ordinal is not safe to persist - changing a flow renumbers it under stored records.
		expect(record).not.toHaveProperty('attackStep');
	});
});
