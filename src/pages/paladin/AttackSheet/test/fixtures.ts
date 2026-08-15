import { PaladinAttackSheetState, PaladinInfo } from "../../PaladinTypes";
import { PaladinAttackSheetStateDefault } from "../AttackSheetStateFunctions";

export const testPaladinInfo: PaladinInfo = {
	attackModifier: 5,
	damageDie: 8,
	damageModifier: 3,
	hasImprovedDS: false,
};

export function buildTestState(overrides: Partial<PaladinAttackSheetState> = {}): PaladinAttackSheetState {
	return {
		...PaladinAttackSheetStateDefault(testPaladinInfo),
		...overrides,
	};
}
