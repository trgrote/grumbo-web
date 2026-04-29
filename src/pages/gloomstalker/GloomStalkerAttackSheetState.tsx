import { AttackSheetActionType, GloomStalkerInfo } from './GloomStalkerTypes';
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

function rollHitDice(hasAdvantage: boolean, hasElvenAccuracy: boolean): number[] {
	const numberOfDice = hasAdvantage ? (hasElvenAccuracy ? 3 : 2) : 1;
	const rolls: number[] = [];
	for (let i = 0; i < numberOfDice; i++) {
		rolls.push(Math.floor(Math.random() * 20) + 1);
	}

	return rolls;
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

	if (action.type === AttackSheetActionType.RollForAttack) {
		const gloomStalkerInfo = action.payload as GloomStalkerInfo;
		const attackRolls = rollHitDice(state.hasAdvantage, gloomStalkerInfo.hasElvenAccuracy);
		return {
			...state,
			attackRolls: attackRolls,
			attackStep: AttackStep.PostHitRoll,
		};
	}

	return {
		...state,
	};
}