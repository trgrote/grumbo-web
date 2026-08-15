import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { GetBestRerollOption, RollDie } from "../AttackSheetStateFunctions";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class RerollWorstDamageDieCommand implements IGSAttackSheetCommand {
	constructor(private rng: () => number = Math.random) { }

	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		const bestRerollOption = GetBestRerollOption(prevState);

		if (!bestRerollOption) {
			return { ...prevState };
		}

		if (bestRerollOption.type === 'piercing') {
			const newPiercingDamageRolls = [...prevState.piercingDamageRolls];
			newPiercingDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize, this.rng);
			return {
				...prevState,
				piercingDamageRolls: newPiercingDamageRolls,
				hasUsedReroll: true,
			};
		} else if (bestRerollOption.type === 'fire') {
			const newFireDamageRolls = [...prevState.fireDamageRolls];
			newFireDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize, this.rng);
			return {
				...prevState,
				fireDamageRolls: newFireDamageRolls,
				hasUsedReroll: true,
			};
		}

		// If for some reason there are no valid reroll options, return the state unchanged
		return {
			...prevState
		};
	}
}