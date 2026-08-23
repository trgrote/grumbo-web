import { describe, expect, it } from 'vitest';
import { CreateAttackSheetReducer } from '@/attackSheet/AttackSheetStateReducer';
import { CreateInitialState } from '@/attackSheet/AttackSheetStateFunctions';
import { AttackStep, GloomStalkerAttackSheetState } from '../GloomStalkerTypes';
import {
	AttackAgainCommand,
	ConfirmDamageCommand,
	ConfirmIsHitCommand,
	ConfirmIsMissCommand,
	GoBackCommand,
	IGSAttackSheetCommand,
	RerollWorstDamageDieCommand,
	RollForAttackCommand,
	RollForDamageCommand,
	SetAdvantageCommand,
	SetApplyHuntersMarkCommand
} from './Commands/AttackSheetCommands';
import { CreateHistoryRecordFromState } from './AttackSheetStateFunctions';
import { buildTestModel } from './test/fixtures';

// Covers the seam the unit tests can't reach on their own: the shared flow commands
// bound to the Gloom Stalker's state, driven through the real reducer and model.
describe('Gloom Stalker attack sheet flow', () => {
	const model = buildTestModel();
	const reducer = CreateAttackSheetReducer(model);

	function run(commands: IGSAttackSheetCommand[], from = CreateInitialState(model)): GloomStalkerAttackSheetState {
		return commands.reduce(reducer, from);
	}

	it('starts at PreHitRoll with a fresh character state', () => {
		const state = CreateInitialState(model);

		expect(state.attackStep).toBe(AttackStep.PreHitRoll);
		expect(state.characterState.attackRolls).toEqual([]);
		expect(state.characterState.hasAdvantage).toBe(false);
	});

	it('walks the full hit path from PreHitRoll to Results', () => {
		const state = run([
			new SetAdvantageCommand(true),
			new RollForAttackCommand(() => 0),
			new ConfirmIsHitCommand(),
			new SetApplyHuntersMarkCommand(true),
			new RollForDamageCommand(() => 0),
			new ConfirmDamageCommand(),
		]);

		expect(state.attackStep).toBe(AttackStep.Results);
		expect(state.characterState.attackRolls).toEqual([1, 1, 1]);   // 3d20 from elven accuracy
		expect(state.characterState.isHit).toBe(true);
		expect(state.characterState.piercingDamageRolls).toEqual([1]);
		expect(state.characterState.forceDamageRolls).toEqual([1]);   // Hunter's Mark
	});

	it('short-circuits to Results on a miss, leaving damage unrolled', () => {
		const state = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsMissCommand(),
		]);

		expect(state.attackStep).toBe(AttackStep.Results);
		expect(state.characterState.isHit).toBe(false);
		expect(state.characterState.piercingDamageRolls).toEqual([]);
	});

	it('clears the attack roll but keeps pre-roll options when stepping back', () => {
		const state = run([
			new SetAdvantageCommand(true),
			new RollForAttackCommand(() => 0.5),
			new GoBackCommand(),
		]);

		expect(state.attackStep).toBe(AttackStep.PreHitRoll);
		expect(state.characterState.attackRolls).toEqual([]);
		expect(state.characterState.isHit).toBe(false);
		expect(state.characterState.hasAdvantage).toBe(true);
	});

	it('clears the damage rolls but keeps pre-damage options when stepping back', () => {
		const state = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsHitCommand(),
			new SetApplyHuntersMarkCommand(true),
			new RollForDamageCommand(() => 0.5),
			new GoBackCommand(),
		]);

		expect(state.attackStep).toBe(AttackStep.PreDamageRoll);
		expect(state.characterState.piercingDamageRolls).toEqual([]);
		expect(state.characterState.forceDamageDicePool).toEqual([]);
		expect(state.characterState.applyHuntersMark).toBe(true);
	});

	it('doubles the damage pools on a critical hit', () => {
		const state = run([
			new RollForAttackCommand(() => 0.999),   // nat 20
			new ConfirmIsHitCommand(),
			new RollForDamageCommand(() => 0.999),
		]);

		expect(state.characterState.attackRolls).toEqual([20]);
		expect(state.characterState.piercingDamageDicePool).toEqual([8, 8, 8]);   // doubled, plus Piercer
		expect(state.characterState.fireDamageDicePool).toEqual([6, 6]);
		expect(state.characterState.piercingDamageRolls).toEqual([8, 8, 8]);
	});

	// hasUsedReroll has a lifecycle spread across three separate units: the reroll command
	// sets it, rollForDamage clears it, and onStepReverted deliberately doesn't touch it.
	it('allows a fresh reroll after stepping back and rolling damage again', () => {
		const rolled = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsHitCommand(),
			new RollForDamageCommand(() => 0),   // all dice on their lowest face
		]);
		expect(rolled.characterState.piercingDamageRolls).toEqual([1]);

		const rerolled = run([new RerollWorstDamageDieCommand(() => 0.999)], rolled);
		expect(rerolled.characterState.piercingDamageRolls).toEqual([8]);
		expect(rerolled.characterState.hasUsedReroll).toBe(true);

		const rerolledAgain = run([new RerollWorstDamageDieCommand(() => 0)], rerolled);
		expect(rerolledAgain.characterState.fireDamageRolls).toEqual([1]);   // the command itself doesn't gate; the step's button does

		const back = run([new GoBackCommand()], rerolled);
		expect(back.attackStep).toBe(AttackStep.PreDamageRoll);
		expect(back.characterState.piercingDamageRolls).toEqual([]);

		const rolledAgain = run([new RollForDamageCommand(() => 0)], back);
		expect(rolledAgain.characterState.hasUsedReroll).toBe(false);
	});

	it('cannot step back out of Results', () => {
		const results = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsMissCommand(),
		]);

		expect(run([new GoBackCommand()], results)).toBe(results);
	});

	it('resets every Gloom Stalker option when attacking again', () => {
		const results = run([
			new SetAdvantageCommand(true),
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsHitCommand(),
			new SetApplyHuntersMarkCommand(true),
			new RollForDamageCommand(() => 0.5),
			new ConfirmDamageCommand(),
		]);

		const state = run([new AttackAgainCommand()], results);

		expect(state.attackStep).toBe(AttackStep.PreHitRoll);
		expect(state.characterState.hasAdvantage).toBe(false);
		expect(state.characterState.applyHuntersMark).toBe(false);
		expect(state.characterState.attackRolls).toEqual([]);
		expect(state.characterState.piercingDamageRolls).toEqual([]);
		expect(state.characterState.isHit).toBe(false);
	});

	it('produces a flat history record matching the persisted shape', () => {
		const state = run([
			new RollForAttackCommand(() => 0.5),
			new ConfirmIsHitCommand(),
			new RollForDamageCommand(() => 0.5),
			new ConfirmDamageCommand(),
		]);

		const record = CreateHistoryRecordFromState(state, () => 12345);

		// Every key sits at the top level, exactly as pre-refactor records were stored.
		expect(record.attackStep).toBe(AttackStep.Results);
		expect(record.timestamp).toBe(12345);
		expect(record.isHit).toBe(true);
		expect(record.attackRolls).toEqual(state.characterState.attackRolls);
		expect(record.gloomStalkerInfo).toEqual(state.characterState.gloomStalkerInfo);
		expect(record).not.toHaveProperty('characterState');
	});
});
