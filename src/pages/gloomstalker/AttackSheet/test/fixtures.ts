import { GloomStalkerAttackSheetState, GloomStalkerInfo } from "../../GloomStalkerTypes";
import { GloomStalkerAttackSheetStateDefault } from "../AttackSheetStateFunctions";

export const testGloomStalkerInfo: GloomStalkerInfo = {
	attackModifier: 5,
	damageDie: 8,
	damageModifier: 3,
	favoredEnemies: [],
};

export function buildTestState(overrides: Partial<GloomStalkerAttackSheetState> = {}): GloomStalkerAttackSheetState {
	return {
		...GloomStalkerAttackSheetStateDefault(testGloomStalkerInfo),
		...overrides,
	};
}
