import { AttackSheetState, AttackStep, ICharacterAttackModel } from "../AttackSheetTypes";

// A deliberately trivial character state, so the generic flow can be tested without
// dragging any real character's rules in.
export interface TestCharacterState {
	attackRolls: number[];
	isHit: boolean;
	damageRolls: number[];
	revertedFrom: AttackStep | null;
	revertedTo: AttackStep | null;
}

export const testCharacterStateDefault: TestCharacterState = {
	attackRolls: [],
	isHit: false,
	damageRolls: [],
	revertedFrom: null,
	revertedTo: null
};

export const allSteps: AttackStep[] = [
	AttackStep.PreAttackRoll,
	AttackStep.PostAttackRoll,
	AttackStep.PreDamageRoll,
	AttackStep.PostDamageRoll,
	AttackStep.Results
];

// Mirrors a character (like the Paladin) whose flow has no PostDamageRoll step.
export const stepsWithoutPostDamageRoll: AttackStep[] = [
	AttackStep.PreAttackRoll,
	AttackStep.PostAttackRoll,
	AttackStep.PreDamageRoll,
	AttackStep.Results
];

// Records what the flow asked of it (and echoes the injected rng) so the generic
// commands can be asserted on purely by what callbacks they fired.
export function buildTestModel(steps: AttackStep[] = allSteps): ICharacterAttackModel<TestCharacterState> {
	return {
		steps,
		createInitialCharacterState: () => ({ ...testCharacterStateDefault }),
		rollForAttack: (characterState, rng) => ({ ...characterState, attackRolls: [rng()] }),
		setIsHit: (characterState, isHit) => ({ ...characterState, isHit }),
		rollForDamage: (characterState, rng) => ({ ...characterState, damageRolls: [rng()] }),
		onStepReverted: (characterState, from, to) => ({ ...characterState, revertedFrom: from, revertedTo: to })
	};
}

export function buildTestState(
	overrides: Partial<TestCharacterState> & { attackStep?: AttackStep; } = {}
): AttackSheetState<TestCharacterState> {
	const { attackStep = AttackStep.PreAttackRoll, ...characterOverrides } = overrides;

	return {
		attackStep,
		characterState: { ...testCharacterStateDefault, ...characterOverrides }
	};
}
