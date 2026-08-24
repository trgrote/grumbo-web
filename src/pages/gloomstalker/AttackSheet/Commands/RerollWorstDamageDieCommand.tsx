import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { RollDie } from "@/utils/Dice";
import { DamageType, GloomStalkerAttackState } from "../../GloomStalkerTypes";
import { GetBestRerollOption } from "../AttackSheetStateFunctions";

export default class RerollWorstDamageDieCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private rng: () => number = Math.random) { super(); }

	protected applyToCharacterState(characterState: GloomStalkerAttackState): GloomStalkerAttackState {
		const bestRerollOption = GetBestRerollOption(characterState);

		if (!bestRerollOption) {
			return { ...characterState };
		}

		if (bestRerollOption.type === DamageType.Piercing) {
			const newPiercingDamageRolls = [...characterState.piercingDamageRolls];
			newPiercingDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize, this.rng);
			return {
				...characterState,
				piercingDamageRolls: newPiercingDamageRolls,
				hasUsedReroll: true,
			};
		} else if (bestRerollOption.type === DamageType.Fire) {
			const newFireDamageRolls = [...characterState.fireDamageRolls];
			newFireDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize, this.rng);
			return {
				...characterState,
				fireDamageRolls: newFireDamageRolls,
				hasUsedReroll: true,
			};
		} else if (bestRerollOption.type === DamageType.Force) {
			const newForceDamageRolls = [...characterState.forceDamageRolls];
			newForceDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize, this.rng);
			return {
				...characterState,
				forceDamageRolls: newForceDamageRolls,
				hasUsedReroll: true,
			};
		}

		// If for some reason there are no valid reroll options, return the state unchanged
		return {
			...characterState
		};
	}
}
