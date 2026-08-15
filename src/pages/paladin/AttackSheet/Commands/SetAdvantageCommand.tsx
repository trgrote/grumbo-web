import { PaladinAttackSheetState } from "../../PaladinTypes";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class SetAdvantageCommand implements IPalAttackSheetCommand {
	constructor(private hasAdvantage: boolean) { }

	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		return {
			...prevState,
			hasAdvantage: this.hasAdvantage
		};
	}
}
