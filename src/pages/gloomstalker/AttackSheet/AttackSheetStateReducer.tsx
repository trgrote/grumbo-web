import { GloomStalkerAttackSheetStateDefault, GetBestRerollOption } from './AttackSheetStateFunctions';
import { AttackSheetActionType, GloomStalkerAttackSheetState, GloomStalkerInfo } from '../GloomStalkerTypes';
import { AttackStep } from '../GloomStalkerTypes';

export interface AttackSheetAction {
	type: AttackSheetActionType;
	payload?: unknown;
}

function rollDie(sides: number): number {
	return Math.floor(Math.random() * sides) + 1;
}

function rollDice(dicePool: number[]): number[] {
	return dicePool.map(sides => rollDie(sides));
}

function rollHitDice(hasAdvantage: boolean, hasElvenAccuracy: boolean): number[] {
	const numberOfDice = hasAdvantage ? (hasElvenAccuracy ? 3 : 2) : 1;
	const rolls: number[] = [];
	for (let i = 0; i < numberOfDice; i++) {
		rolls.push(rollDie(20));
	}

	return rolls;
}

function getPiercingDamageDicePool(state: GloomStalkerAttackSheetState): number[] {
	const {
		isDreadAmbusherExtraAttack,
		applyHuntersMark,
	} = state;

	const {
		damageDie,
		hasPiercer
	} = state.gloomStalkerInfo;

	const highestRoll = Math.max(...state.attackRolls);
	const isCritical = highestRoll >= 20;

	const piercingDamageDicePool: number[] = [];

	// Base Weapon Attack
	piercingDamageDicePool.push(damageDie);

	// Dread Ambusher Bonus: If it's the first turn of combat, and the attack is the first attack of the turn, then Dread Ambusher adds an additional weapon damage
	if (isDreadAmbusherExtraAttack) {
		piercingDamageDicePool.push(damageDie);
	}

	if (applyHuntersMark) {
		piercingDamageDicePool.push(6);   // Hunter's Mark adds 1d6 damage on hit
	}

	if (isCritical) {
		// on a critical hit, you roll all of the attack's damage dice an additional time
		piercingDamageDicePool.push(...piercingDamageDicePool);
	}

	if (hasPiercer && isCritical) {
		piercingDamageDicePool.push(damageDie);   // Piercer adds additonal weapon damage on crit
	}

	return piercingDamageDicePool;
}

function getFireDamageDicePool(state: GloomStalkerAttackSheetState): number[] {
	const {
		hasDragonsWrathLongbowStirring
	} = state.gloomStalkerInfo;

	const highestRoll = Math.max(...state.attackRolls);
	const isCritical = highestRoll >= 20;

	const fireDamageDicePool: number[] = [];

	if (hasDragonsWrathLongbowStirring) {
		fireDamageDicePool.push(6);   // Dragon's Wrath Longbow Stirrings adds 1d6 damage on hit
	}

	if (isCritical) {
		fireDamageDicePool.push(...fireDamageDicePool);   // on a critical hit, you roll all of the attack's damage dice an additional time
	}

	return fireDamageDicePool;
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
		const attackRolls = rollHitDice(state.hasAdvantage, state.gloomStalkerInfo.hasElvenAccuracy);
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
		const piercingDamageDicePool = getPiercingDamageDicePool(state);
		const fireDamageDicePool = getFireDamageDicePool(state);

		return {
			...state,
			attackStep: AttackStep.PostDamageRoll,
			piercingDamageDicePool,
			piercingDamageRolls: rollDice(piercingDamageDicePool),
			fireDamageDicePool,
			fireDamageRolls: rollDice(fireDamageDicePool),
		};
	}

	if (action.type === AttackSheetActionType.RerollPiercingDamageDie) {
		const bestRerollOption = GetBestRerollOption(state);

		if (bestRerollOption.type === 'piercing') {
			const newPiercingDamageRolls = [...state.piercingDamageRolls];
			newPiercingDamageRolls[bestRerollOption.index] = rollDie(bestRerollOption.die);
			return {
				...state,
				piercingDamageRolls: newPiercingDamageRolls,
			};
		} else if (bestRerollOption.type === 'fire') {
			const newFireDamageRolls = [...state.fireDamageRolls];
			newFireDamageRolls[bestRerollOption.index] = rollDie(bestRerollOption.die);
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