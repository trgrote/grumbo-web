import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import { RollHitDice } from "../AttackSheetStateFunctions";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class RollForAttackCommand implements IGSAttackSheetCommand {
	constructor(private rng: () => number = Math.random) { }

	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		const attackRolls = RollHitDice(prevState.hasAdvantage, this.rng);
		return {
			...prevState,
			attackRolls: attackRolls,
			attackStep: AttackStep.PostHitRoll,
		};
	}
}