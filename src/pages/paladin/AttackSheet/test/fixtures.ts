import { AttackStep, PaladinAttackSheetState, PaladinAttackState, PaladinInfo } from "../../PaladinTypes";
import { PaladinAttackStateDefault } from "../AttackSheetStateFunctions";
import PaladinAttackModel from "../PaladinAttackModel";

export const testPaladinInfo: PaladinInfo = {
	attackModifier: 5,
	damageDie: 8,
	damageModifier: 3,
	hasImprovedDS: false,
};

export function buildTestModel(paladinInfo: PaladinInfo = testPaladinInfo): PaladinAttackModel {
	return new PaladinAttackModel(paladinInfo);
}

export function buildTestCharacterState(overrides: Partial<PaladinAttackState> = {}): PaladinAttackState {
	return {
		...PaladinAttackStateDefault(testPaladinInfo),
		...overrides,
	};
}

// Takes flat overrides (with `attackStep` alongside the character-state fields) and splits them
// into the two slices, so callers don't have to spell out the nesting.
export function buildTestState(
	overrides: Partial<PaladinAttackState> & { attackStep?: AttackStep; } = {}
): PaladinAttackSheetState {
	const { attackStep = AttackStep.PreAttackRoll, ...characterOverrides } = overrides;

	return {
		attackStep,
		characterState: buildTestCharacterState(characterOverrides),
	};
}
