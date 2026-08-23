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
	AttackStep.PreHitRoll,
	AttackStep.PostHitRoll,
	AttackStep.PreDamageRoll,
	AttackStep.PostDamageRoll,
	AttackStep.Results
];

// Mirrors a character (like the Paladin) whose flow has no PostDamageRoll step.
export const stepsWithoutPostDamageRoll: AttackStep[] = [
	AttackStep.PreHitRoll,
	AttackStep.PostHitRoll,
	AttackStep.PreDamageRoll,
	AttackStep.Results
];

// Records what the flow asked of it (and echoes the injected rng) so the generic
// commands can be asserted on purely by what callbacks they fired.
export function buildTestModel(steps: AttackStep[] = allSteps): ICharacterAttackModel<TestCharacterState> {
	return {
		steps,
		createInitialCharacterState: () => ({ ...testCharacterStateDefault }),
		rollForAttack: (character, rng) => ({ ...character, attackRolls: [rng()] }),
		setIsHit: (character, isHit) => ({ ...character, isHit }),
		rollForDamage: (character, rng) => ({ ...character, damageRolls: [rng()] }),
		onStepReverted: (character, from, to) => ({ ...character, revertedFrom: from, revertedTo: to })
	};
}

export function buildTestState(
	overrides: Partial<TestCharacterState> & { attackStep?: AttackStep; } = {}
): AttackSheetState<TestCharacterState> {
	const { attackStep = AttackStep.PreHitRoll, ...characterOverrides } = overrides;

	return {
		attackStep,
		character: { ...testCharacterStateDefault, ...characterOverrides }
	};
}
