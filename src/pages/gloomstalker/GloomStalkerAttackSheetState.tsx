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
		applyHuntersMark: false,
		piercingDamageRolls: [],
		piercingDamageDicePool: [],
		fireDamageDicePool: [],
		fireDamageRolls: [],
		applyDragonSlumberDamage: false
	};
}

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

function getPiercingDamageDicePool(state: GloomStalkerAttackSheetState, gloomStalkerInfo: GloomStalkerInfo): number[] {
	const {
		isDreadAmbusherExtraAttack,
		applyHuntersMark,
	} = state;

	const {
		damageDie,
		hasPiercer
	} = gloomStalkerInfo;

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

	if (hasPiercer) {
		piercingDamageDicePool.push(damageDie);   // Piercer adds additonal weapon damage on crit
	}

	return piercingDamageDicePool;
}

function getFireDamageDicePool(state: GloomStalkerAttackSheetState, gloomStalkerInfo: GloomStalkerInfo): number[] {
	const {
		hasDragonsWrathLongbowStirring
	} = gloomStalkerInfo;

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

	if (action.type === AttackSheetActionType.SetApplyHuntersMark) {
		return {
			...state,
			applyHuntersMark: action.payload as boolean,
		};
	}

	if (action.type === AttackSheetActionType.RollForDamage) {
		const gloomStalkerInfo = action.payload as GloomStalkerInfo;
		const piercingDamageDicePool = getPiercingDamageDicePool(state, gloomStalkerInfo);
		const fireDamageDicePool = getFireDamageDicePool(state, gloomStalkerInfo);

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

		// TODO Implement Reroll Lowest Piercing Damage Die functionality
		// We need to track what the original die sides were in order to properly reroll, 
		// since some of the piercing damage dice can come from different sources (e.g. weapon damage die vs Hunter's Mark damage die)
		return {
			...state,
			piercingDamageRolls: state.piercingDamageRolls,
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