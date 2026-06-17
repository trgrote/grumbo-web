import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { GetBestRerollOption, RollDie } from "../AttackSheetStateFunctions";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class RerollPiercingDamageDieCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		const bestRerollOption = GetBestRerollOption(prevState);

		if (bestRerollOption.type === 'piercing') {
			const newPiercingDamageRolls = [...prevState.piercingDamageRolls];
			newPiercingDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize);
			return {
				...prevState,
				piercingDamageRolls: newPiercingDamageRolls,
			};
		} else if (bestRerollOption.type === 'fire') {
			const newFireDamageRolls = [...prevState.fireDamageRolls];
			newFireDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize);
			return {
				...prevState,
				fireDamageRolls: newFireDamageRolls,
			};
		}

		// If for some reason there are no valid reroll options, return the state unchanged
		return {
			...prevState
		};
	}
}