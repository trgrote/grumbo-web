import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import { GetFireDamageDicePool, GetPiercingDamageDicePool, RollDice } from "../AttackSheetStateFunctions";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class RollForDamageCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		const piercingDamageDicePool = GetPiercingDamageDicePool(prevState);
		const fireDamageDicePool = GetFireDamageDicePool(prevState);

		return {
			...prevState,
			attackStep: AttackStep.PostDamageRoll,
			piercingDamageDicePool,
			piercingDamageRolls: RollDice(piercingDamageDicePool),
			fireDamageDicePool,
			fireDamageRolls: RollDice(fireDamageDicePool),
		};
	}
}