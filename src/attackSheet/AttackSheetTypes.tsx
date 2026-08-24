// The character-agnostic attack sheet flow.
//
// Only `attackStep` is generic; every other piece of state belongs to the character,
// because the rules around it (how many d20s advantage rolls, what counts as a crit,
// which damage pools exist) genuinely differ per character.

export enum AttackStep {
	PreAttackRoll,
	PostAttackRoll,
	PreDamageRoll,
	PostDamageRoll,
	Results
}

export interface AttackSheetState<TCharacterState> {
	attackStep: AttackStep;

	// The in-progress state of this attack under the character's own rules - rolls made so
	// far, options toggled, dice pools built. Not the character's stats or config, though a
	// copy of those is usually carried along inside it for the rules to read.
	characterState: TCharacterState;
}

export interface IAttackSheetCommand<TCharacterState> {
	apply: (prevState: AttackSheetState<TCharacterState>, model: ICharacterAttackModel<TCharacterState>) => AttackSheetState<TCharacterState>;
}

// The callback surface the shared flow calls into. One instance is built per character
// info object, so it owns that info and the commands don't have to carry it around.
export interface ICharacterAttackModel<TCharacterState> {
	// The ordered steps this character's flow walks through. Drives both advancing and
	// going back, so a character that has no PostDamageRoll step simply omits it.
	// Must be non-empty and in flow order: the first entry is where the sheet starts and
	// the last is where a miss short-circuits to.
	readonly steps: AttackStep[];

	createInitialCharacterState: () => TCharacterState;
	rollForAttack: (characterState: TCharacterState, rng: () => number) => TCharacterState;
	setIsHit: (characterState: TCharacterState, isHit: boolean) => TCharacterState;
	rollForDamage: (characterState: TCharacterState, rng: () => number) => TCharacterState;

	// Called when the sheet steps backwards, so the character state can clear whatever
	// rolls the step being abandoned produced.
	onStepReverted: (characterState: TCharacterState, from: AttackStep, to: AttackStep) => TCharacterState;
}
