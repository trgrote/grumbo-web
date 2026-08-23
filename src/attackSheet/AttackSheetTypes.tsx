// The character-agnostic attack sheet flow.
//
// Only `attackStep` is generic; every other piece of state lives in the character
// slice, because the rules around it (how many d20s advantage rolls, what counts as
// a crit, which damage pools exist) genuinely differ per character.

export enum AttackStep {
	PreHitRoll,
	PostHitRoll,
	PreDamageRoll,
	PostDamageRoll,
	Results
}

export interface AttackSheetState<TCharacter> {
	attackStep: AttackStep;
	character: TCharacter;
}

export interface IAttackSheetCommand<TCharacter> {
	apply: (prevState: AttackSheetState<TCharacter>, model: ICharacterAttackModel<TCharacter>) => AttackSheetState<TCharacter>;
}

// The callback surface the shared flow calls into. One instance is built per character
// info object, so it owns that info and the commands don't have to carry it around.
export interface ICharacterAttackModel<TCharacter> {
	// The ordered steps this character's flow walks through. Drives both advancing and
	// going back, so a character that has no PostDamageRoll step simply omits it.
	// Must be non-empty and in flow order: the first entry is where the sheet starts and
	// the last is where a miss short-circuits to.
	readonly steps: AttackStep[];

	createInitialCharacterState: () => TCharacter;
	rollForAttack: (character: TCharacter, rng: () => number) => TCharacter;
	setIsHit: (character: TCharacter, isHit: boolean) => TCharacter;
	rollForDamage: (character: TCharacter, rng: () => number) => TCharacter;

	// Called when the sheet steps backwards, so the character state can clear whatever
	// rolls the step being abandoned produced.
	onStepReverted: (character: TCharacter, from: AttackStep, to: AttackStep) => TCharacter;
}
