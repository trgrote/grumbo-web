import { PaladinAttackSheetState } from "../../PaladinTypes";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class SetIsTargetFiendOrUndeadCommand implements IPalAttackSheetCommand {
	constructor(private isTargetFiendOrUndead: boolean) { }

	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		return {
			...prevState,
			isTargetFiendOrUndead: this.isTargetFiendOrUndead
		};
	}
}
