import { AttackStep, PaladinAttackSheetState } from "../../PaladinTypes";
import { GetDivineSmiteDamageDicePool, GetWeaponDamageDicePool } from "../AttackSheetStateFunctions";
import { RollDice } from "@/utils/Dice";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class RollForDamageCommand implements IPalAttackSheetCommand {
	constructor(private rng: () => number = Math.random) { }

	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		const weaponDamageDicePool = GetWeaponDamageDicePool(prevState);
		const divineSmiteDamageDicePool = GetDivineSmiteDamageDicePool(prevState);

		return {
			...prevState,
			attackStep: AttackStep.Results,
			weaponDamageRolls: RollDice(weaponDamageDicePool, this.rng),
			divineSmiteDamageRolls: RollDice(divineSmiteDamageDicePool, this.rng),
		};
	}
}
