import { AttackStep, GloomStalkerAttackSheetState, GloomStalkerAttackState, GloomStalkerInfo } from "../../GloomStalkerTypes";
import { GloomStalkerAttackStateDefault } from "../AttackSheetStateFunctions";
import GloomStalkerAttackModel from "../GloomStalkerAttackModel";

export const testGloomStalkerInfo: GloomStalkerInfo = {
	attackModifier: 5,
	damageDie: 8,
	damageModifier: 3,
	favoredEnemies: [],
};

export function buildTestModel(gloomStalkerInfo: GloomStalkerInfo = testGloomStalkerInfo): GloomStalkerAttackModel {
	return new GloomStalkerAttackModel(gloomStalkerInfo);
}

export function buildTestCharacterState(overrides: Partial<GloomStalkerAttackState> = {}): GloomStalkerAttackState {
	return {
		...GloomStalkerAttackStateDefault(testGloomStalkerInfo),
		...overrides,
	};
}

// Takes flat overrides (with `attackStep` alongside the character-state fields) and splits them
// into the two slices, so callers don't have to spell out the nesting.
export function buildTestState(
	overrides: Partial<GloomStalkerAttackState> & { attackStep?: AttackStep; } = {}
): GloomStalkerAttackSheetState {
	const { attackStep = AttackStep.PreHitRoll, ...characterOverrides } = overrides;

	return {
		attackStep,
		characterState: buildTestCharacterState(characterOverrides),
	};
}
