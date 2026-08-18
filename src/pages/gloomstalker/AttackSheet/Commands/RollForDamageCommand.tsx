import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import { GetFireDamageDicePool, GetForceDamageDicePool, GetPiercingDamageDicePool } from "../AttackSheetStateFunctions";
import { RollDice } from "@/utils/Dice";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class RollForDamageCommand implements IGSAttackSheetCommand {
	constructor(private rng: () => number = Math.random) { }

	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		const piercingDamageDicePool = GetPiercingDamageDicePool(prevState);
		const fireDamageDicePool = GetFireDamageDicePool(prevState);
		const forceDamageDicePool = GetForceDamageDicePool(prevState);

		return {
			...prevState,
			attackStep: AttackStep.PostDamageRoll,
			piercingDamageDicePool,
			piercingDamageRolls: RollDice(piercingDamageDicePool, this.rng),
			fireDamageDicePool,
			fireDamageRolls: RollDice(fireDamageDicePool, this.rng),
			forceDamageDicePool,
			forceDamageRolls: RollDice(forceDamageDicePool, this.rng),
			hasUsedReroll: false,
		};
	}
}