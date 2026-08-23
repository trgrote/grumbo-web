import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { RollDie } from "@/utils/Dice";
import { DamageType, GloomStalkerAttackState } from "../../GloomStalkerTypes";
import { GetBestRerollOption } from "../AttackSheetStateFunctions";

export default class RerollWorstDamageDieCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private rng: () => number = Math.random) { super(); }

	protected applyToCharacter(character: GloomStalkerAttackState): GloomStalkerAttackState {
		const bestRerollOption = GetBestRerollOption(character);

		if (!bestRerollOption) {
			return { ...character };
		}

		if (bestRerollOption.type === DamageType.Piercing) {
			const newPiercingDamageRolls = [...character.piercingDamageRolls];
			newPiercingDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize, this.rng);
			return {
				...character,
				piercingDamageRolls: newPiercingDamageRolls,
				hasUsedReroll: true,
			};
		} else if (bestRerollOption.type === DamageType.Fire) {
			const newFireDamageRolls = [...character.fireDamageRolls];
			newFireDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize, this.rng);
			return {
				...character,
				fireDamageRolls: newFireDamageRolls,
				hasUsedReroll: true,
			};
		} else if (bestRerollOption.type === DamageType.Force) {
			const newForceDamageRolls = [...character.forceDamageRolls];
			newForceDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize, this.rng);
			return {
				...character,
				forceDamageRolls: newForceDamageRolls,
				hasUsedReroll: true,
			};
		}

		// If for some reason there are no valid reroll options, return the state unchanged
		return {
			...character
		};
	}
}
