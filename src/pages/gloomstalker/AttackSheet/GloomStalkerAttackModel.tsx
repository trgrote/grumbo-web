import { AttackStep, ICharacterAttackModel } from "@/attackSheet/AttackSheetTypes";
import { RollDice } from "@/utils/Dice";
import { GloomStalkerAttackState, GloomStalkerInfo } from "../GloomStalkerTypes";
import {
	GetFireDamageDicePool,
	GetForceDamageDicePool,
	GetPiercingDamageDicePool,
	GloomStalkerAttackStateDefault,
	RollAttackDice
} from "./AttackSheetStateFunctions";

// The Gloom Stalker's half of the attack sheet: everything the shared flow has to call
// back into because it depends on this character's rules.
export default class GloomStalkerAttackModel implements ICharacterAttackModel<GloomStalkerAttackState> {
	readonly steps: AttackStep[] = [
		AttackStep.PreAttackRoll,
		AttackStep.PostAttackRoll,
		AttackStep.PreDamageRoll,
		AttackStep.PostDamageRoll,
		AttackStep.Results
	];

	constructor(private gloomStalkerInfo: GloomStalkerInfo) { }

	createInitialCharacterState(): GloomStalkerAttackState {
		return GloomStalkerAttackStateDefault(this.gloomStalkerInfo);
	}

	rollForAttack(characterState: GloomStalkerAttackState, rng: () => number): GloomStalkerAttackState {
		return {
			...characterState,
			attackRolls: RollAttackDice(characterState.hasAdvantage, rng)
		};
	}

	setIsHit(characterState: GloomStalkerAttackState, isHit: boolean): GloomStalkerAttackState {
		return {
			...characterState,
			isHit
		};
	}

	rollForDamage(characterState: GloomStalkerAttackState, rng: () => number): GloomStalkerAttackState {
		const piercingDamageDicePool = GetPiercingDamageDicePool(characterState);
		const fireDamageDicePool = GetFireDamageDicePool(characterState);
		const forceDamageDicePool = GetForceDamageDicePool(characterState);

		return {
			...characterState,
			piercingDamageDicePool,
			piercingDamageRolls: RollDice(piercingDamageDicePool, rng),
			fireDamageDicePool,
			fireDamageRolls: RollDice(fireDamageDicePool, rng),
			forceDamageDicePool,
			forceDamageRolls: RollDice(forceDamageDicePool, rng),
			hasUsedReroll: false
		};
	}

	// Discard whatever rolls the step being abandoned produced. Only the step being left
	// matters, so `to` is unused: every reachable backward transition is between adjacent
	// steps, because GoBackCommand refuses to step back out of the final step (the only
	// step this flow can reach by skipping others).
	onStepReverted(characterState: GloomStalkerAttackState, from: AttackStep): GloomStalkerAttackState {
		switch (from) {
			case AttackStep.PostAttackRoll:
				return {
					...characterState,
					attackRolls: [],
					isHit: false
				};
			case AttackStep.PostDamageRoll:
				return {
					...characterState,
					piercingDamageDicePool: [],
					piercingDamageRolls: [],
					fireDamageDicePool: [],
					fireDamageRolls: [],
					forceDamageDicePool: [],
					forceDamageRolls: []
				};
			default:
				return characterState;
		}
	}
}
