import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import { RollHitDice } from "../AttackSheetStateFunctions";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class RollForAttackCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		const attackRolls = RollHitDice(prevState.hasAdvantage);
		return {
			...prevState,
			attackRolls: attackRolls,
			attackStep: AttackStep.PostHitRoll,
		};
	}
}