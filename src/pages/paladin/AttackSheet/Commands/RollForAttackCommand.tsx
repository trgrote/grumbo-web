import { AttackStep, PaladinAttackSheetState } from "../../PaladinTypes";
import { RollAttackDice } from "../AttackSheetStateFunctions";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class RollForAttackCommand implements IPalAttackSheetCommand {
	constructor(private rng: () => number = Math.random) { }

	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		const attackRolls = RollAttackDice(prevState.hasAdvantage, this.rng);
		return {
			...prevState,
			attackRolls: attackRolls,
			attackStep: AttackStep.PostAttackRoll,
		};
	}
}
