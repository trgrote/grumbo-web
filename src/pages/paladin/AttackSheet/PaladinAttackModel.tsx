import { AttackStep, ICharacterAttackModel } from "@/attackSheet/AttackSheetTypes";
import { RollDice } from "@/utils/Dice";
import { PaladinAttackState, PaladinInfo } from "../PaladinTypes";
import {
	GetDivineSmiteDamageDicePool,
	GetWeaponDamageDicePool,
	PaladinAttackStateDefault,
	RollAttackDice
} from "./AttackSheetStateFunctions";

// The Paladin's half of the attack sheet: everything the shared flow has to call back into
// because it depends on this character's rules.
export default class PaladinAttackModel implements ICharacterAttackModel<PaladinAttackState> {
	// Deliberately no PostDamageRoll - the Paladin has nothing to confirm after rolling
	// damage, so rolling damage advances straight to Results.
	readonly steps: AttackStep[] = [
		AttackStep.PreAttackRoll,
		AttackStep.PostAttackRoll,
		AttackStep.PreDamageRoll,
		AttackStep.Results
	];

	constructor(private paladinInfo: PaladinInfo) { }

	createInitialCharacterState(): PaladinAttackState {
		return PaladinAttackStateDefault(this.paladinInfo);
	}

	rollForAttack(characterState: PaladinAttackState, rng: () => number): PaladinAttackState {
		return {
			...characterState,
			attackRolls: RollAttackDice(characterState.hasAdvantage, rng)
		};
	}

	setIsHit(characterState: PaladinAttackState, isHit: boolean): PaladinAttackState {
		return {
			...characterState,
			isHit
		};
	}

	rollForDamage(characterState: PaladinAttackState, rng: () => number): PaladinAttackState {
		const weaponDamageDicePool = GetWeaponDamageDicePool(characterState);
		const divineSmiteDamageDicePool = GetDivineSmiteDamageDicePool(characterState);

		return {
			...characterState,
			weaponDamageRolls: RollDice(weaponDamageDicePool, rng),
			divineSmiteDamageRolls: RollDice(divineSmiteDamageDicePool, rng)
		};
	}

	// Discard whatever rolls the step being abandoned produced. Only the step being left
	// matters, so `to` is unused: every reachable backward transition is between adjacent
	// steps, because GoBackCommand refuses to step back out of the final step.
	onStepReverted(characterState: PaladinAttackState, from: AttackStep): PaladinAttackState {
		switch (from) {
			case AttackStep.PostAttackRoll:
				return {
					...characterState,
					attackRolls: [],
					isHit: false
				};
			default:
				return characterState;
		}
	}
}
