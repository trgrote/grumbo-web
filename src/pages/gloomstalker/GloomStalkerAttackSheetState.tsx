import { PostDamageRollInfo, PostHitRollInfo, PreHitRollInfo } from "./GloomStalkerTypes";

export enum AttackStep {
	PreHitRoll,
	PostHitRoll,
	PreDamageRoll,
	PostDamageRoll
}

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

export enum AttackSheetActionType {
	Reset,
	SetAdvantage,
	SetApplySharpShooterPenalty,
	RollForAttack,
	ConfirmHit,
	RerollPiercingDamageDie,
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

	return {
		...state,
	};
}