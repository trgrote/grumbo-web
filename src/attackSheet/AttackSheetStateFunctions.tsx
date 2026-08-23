import { AttackSheetState, AttackStep, ICharacterAttackModel } from "./AttackSheetTypes";

export function CreateInitialState<TCharacter>(model: ICharacterAttackModel<TCharacter>): AttackSheetState<TCharacter> {
	return {
		attackStep: model.steps[0],
		character: model.createInitialCharacterState()
	};
}

// The step after `step` in this character's flow. Returns `step` itself when it's the
// last one, so advancing past the end is a no-op rather than an error.
export function GetNextStep<TCharacter>(model: ICharacterAttackModel<TCharacter>, step: AttackStep): AttackStep {
	const index = model.steps.indexOf(step);

	if (index < 0 || index === model.steps.length - 1) {
		return step;
	}

	return model.steps[index + 1];
}

// The step before `step` in this character's flow. Returns `step` itself when it's the
// first one, which is how GoBackCommand knows there's nowhere to go.
export function GetPreviousStep<TCharacter>(model: ICharacterAttackModel<TCharacter>, step: AttackStep): AttackStep {
	const index = model.steps.indexOf(step);

	if (index <= 0) {
		return step;
	}

	return model.steps[index - 1];
}
