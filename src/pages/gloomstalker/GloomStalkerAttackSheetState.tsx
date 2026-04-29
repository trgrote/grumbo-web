import { AttackSheetActionType, GloomStalkerInfo, PreDamageRollInfo } from './GloomStalkerTypes';
import { AttackStep } from './GloomStalkerTypes';
import { PostDamageRollInfo, PostHitRollInfo, PreHitRollInfo } from "./GloomStalkerTypes";

export interface GloomStalkerAttackSheetState extends PreHitRollInfo, PostHitRollInfo, PreDamageRollInfo, PostDamageRollInfo {
	attackStep: AttackStep;
}

export function GloomStalkerAttackSheetStateDefault(): GloomStalkerAttackSheetState {
	return {
		attackStep: AttackStep.PreHitRoll,
		hasAdvantage: false,
		applySharpShooterPenalty: false,
		attackRolls: [],
		isHit: false,
		isDreadAmbusherExtraAttack: false,
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

	if (action.type === AttackSheetActionType.ConfirmIsHit) {
		return {
			...state,
			isHit: true,
			attackStep: AttackStep.PreDamageRoll,
		};
	}

	if (action.type === AttackSheetActionType.ConfirmIsMiss) {
		return {
			...state,
			isHit: false,
			attackStep: AttackStep.Results,
		};
	}

	if (action.type === AttackSheetActionType.SetIsDreadAmbusherExtraAttack) {
		return {
			...state,
			isDreadAmbusherExtraAttack: action.payload as boolean,
		};
	}

	if (action.type === AttackSheetActionType.GoBack) {
		const prevState = (() => {
			switch (state.attackStep) {
				case AttackStep.PostHitRoll:
					return AttackStep.PreHitRoll;
				case AttackStep.PreDamageRoll:
					return AttackStep.PostHitRoll;
				default:
					return state.attackStep;
			}
		})();

		return {
			...state,
			attackStep: prevState,
		};
	}

	return {
		...state,
	};
}