import { GloomStalkerAttackSheetStateDefault, GetBestRerollOption, RollHitDice, RollDice, GetFireDamageDicePool, GetPiercingDamageDicePool, RollDie } from './AttackSheetStateFunctions';
import { AttackSheetActionType, GloomStalkerAttackSheetState, GloomStalkerInfo } from '../GloomStalkerTypes';
import { AttackStep } from '../GloomStalkerTypes';

export interface AttackSheetAction {
	type: AttackSheetActionType;
	payload?: boolean | GloomStalkerInfo;
}

export function AttackSheetStateReducer(state: GloomStalkerAttackSheetState, action: AttackSheetAction): GloomStalkerAttackSheetState {
	if (action.type === AttackSheetActionType.Reset) {
		return GloomStalkerAttackSheetStateDefault(action.payload as GloomStalkerInfo);
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
		const attackRolls = RollHitDice(state.hasAdvantage);
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

	if (action.type === AttackSheetActionType.SetApplyHuntersMark) {
		return {
			...state,
			applyHuntersMark: action.payload as boolean,
		};
	}

	if (action.type === AttackSheetActionType.RollForDamage) {
		const piercingDamageDicePool = GetPiercingDamageDicePool(state);
		const fireDamageDicePool = GetFireDamageDicePool(state);

		return {
			...state,
			attackStep: AttackStep.PostDamageRoll,
			piercingDamageDicePool,
			piercingDamageRolls: RollDice(piercingDamageDicePool),
			fireDamageDicePool,
			fireDamageRolls: RollDice(fireDamageDicePool),
		};
	}

	if (action.type === AttackSheetActionType.RerollPiercingDamageDie) {
		const bestRerollOption = GetBestRerollOption(state);

		if (bestRerollOption.type === 'piercing') {
			const newPiercingDamageRolls = [...state.piercingDamageRolls];
			newPiercingDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize);
			return {
				...state,
				piercingDamageRolls: newPiercingDamageRolls,
			};
		} else if (bestRerollOption.type === 'fire') {
			const newFireDamageRolls = [...state.fireDamageRolls];
			newFireDamageRolls[bestRerollOption.dicePoolIndex] = RollDie(bestRerollOption.dieSize);
			return {
				...state,
				fireDamageRolls: newFireDamageRolls,
			};
		}

		// If for some reason there are no valid reroll options, return the state unchanged
		return {
			...state
		};
	}

	if (action.type === AttackSheetActionType.ConfirmDamage) {
		return {
			...state,
			attackStep: AttackStep.Results,
		};
	}

	if (action.type === AttackSheetActionType.AttackAgain) {
		return GloomStalkerAttackSheetStateDefault(state.gloomStalkerInfo);
	}

	if (action.type === AttackSheetActionType.GoBack) {
		const prevState = (() => {
			switch (state.attackStep) {
				case AttackStep.PostHitRoll:
					return AttackStep.PreHitRoll;
				case AttackStep.PreDamageRoll:
					return AttackStep.PostHitRoll;
				case AttackStep.PostDamageRoll:
					return AttackStep.PreDamageRoll;
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