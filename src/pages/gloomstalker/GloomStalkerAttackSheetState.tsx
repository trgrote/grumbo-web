import { AttackSheetActionType } from './GloomStalkerTypes';
import { AttackStep } from './GloomStalkerTypes';
import { PostDamageRollInfo, PostHitRollInfo, PreHitRollInfo } from "./GloomStalkerTypes";

export interface GloomStalkerAttackSheetState extends PreHitRollInfo, PostHitRollInfo, PostDamageRollInfo {
	attackStep: AttackStep;
}

export function GloomStalkerAttackSheetStateDefault(): GloomStalkerAttackSheetState {
	return {
		attackStep: AttackStep.PreHitRoll,
		hasAdvantage: false,
		applySharpShooterPenalty: false,
		attackRolls: [],
		isHit: false,
		rerollPiercingDamageDieIndex: null,
		piercingDamageRolls: [],
		applyDragonSlumberDamage: false
	};
}

export interface AttackSheetAction {
	type: AttackSheetActionType;
	payload?: unknown;
}

export function GloomStalkerAttackSheetStateReducer(state: GloomStalkerAttackSheetState, action: AttackSheetAction): GloomStalkerAttackSheetState {
	if (action.type === AttackSheetActionType.Reset) {
		return GloomStalkerAttackSheetStateDefault();
	}

	if (action.type === AttackSheetActionType.SetAdvantage) {
		return {
			...state,
			hasAdvantage: action.payload as boolean
		};
	}

	if (action.type === AttackSheetActionType.SetApplySharpShooterPenalty) {
		return {
			...state,
			applySharpShooterPenalty: action.payload as boolean
		};
	}

	return {
		...state,
	};
}