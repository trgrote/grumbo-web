import { GloomStalkerInfo, GloomStalkerAttackState, GloomStalkerAttackSheetState, HistoryRecord, CritStatus, DamageType } from "../GloomStalkerTypes";
import { RollDie } from "@/utils/Dice";

export function GloomStalkerAttackStateDefault(gloomStalkerInfo: GloomStalkerInfo): GloomStalkerAttackState {
	return {
		gloomStalkerInfo: { ...gloomStalkerInfo },
		hasAdvantage: false,
		applySharpShooterPenalty: false,
		selectedFavoredEnemies: [],
		attackRolls: [],
		isHit: false,
		isDreadAmbusherExtraAttack: false,
		applyHuntersMark: false,
		piercingDamageRolls: [],
		piercingDamageDicePool: [],
		fireDamageDicePool: [],
		fireDamageRolls: [],
		forceDamageDicePool: [],
		forceDamageRolls: [],
		hasUsedReroll: false
	};
}

export interface RolledDie {
	dieSize: number;
	roll: number;
	type: DamageType;
	dicePoolIndex: number;
}

// Select the best die to reroll.
// The best die to reroll is the one that has the lowest value.
// Tiebreaker goes to the highest die (e.g. it's better to reroll a 1 on a d12 than a 1 on a d6)
export function GetBestRerollOption(state: GloomStalkerAttackState): RolledDie | null {
	const allRolls: RolledDie[] = [
		...state.piercingDamageRolls.map((roll, i) => ({ roll, dieSize: state.piercingDamageDicePool[i], type: DamageType.Piercing, dicePoolIndex: i })),
		...state.fireDamageRolls.map((roll, i) => ({ roll, dieSize: state.fireDamageDicePool[i], type: DamageType.Fire, dicePoolIndex: i })),
		...state.forceDamageRolls.map((roll, i) => ({ roll, dieSize: state.forceDamageDicePool[i], type: DamageType.Force, dicePoolIndex: i }))
	];

	const rerollableRolls = allRolls.filter(r => r.roll < r.dieSize);

	if (rerollableRolls.length === 0) {
		return null;
	}

	return rerollableRolls.reduce((best, current) => {
		if (current.roll < best.roll || (current.roll === best.roll && current.dieSize > best.dieSize)) {
			return {
				dieSize: current.dieSize,
				roll: current.roll,
				type: current.type,
				dicePoolIndex: current.dicePoolIndex
			};
		}
		return best;
	}, rerollableRolls[0]);
}

// Flattens the sheet state into the shape history has always been persisted in.
export function CreateHistoryRecordFromState(state: GloomStalkerAttackSheetState, now: () => number = Date.now): HistoryRecord {
	return {
		...state.characterState,
		gloomStalkerInfo: { ...state.characterState.gloomStalkerInfo },   // force a shallow copy of the gloomStalkerInfo to prevent mutation issues
		attackStep: state.attackStep,
		timestamp: now()
	};
}

export function GetHighestHitRoll(state: GloomStalkerAttackState): number {
	// TODO If we add disadvantage, we need to select the lowest instead of the highest
	return Math.max(...state.attackRolls);
}

export function GetCritStatus(state: GloomStalkerAttackState): CritStatus {
	const highestRoll = GetHighestHitRoll(state);

	if (highestRoll === 20) {
		return CritStatus.CriticalHit;
	}
	if (highestRoll === 1) {
		return CritStatus.CriticalMiss;
	}
	return CritStatus.Normal;
}

export function GetHitStatusText(state: GloomStalkerAttackState): string {
	const isCriticalHitOrMiss = GetCritStatus(state) !== CritStatus.Normal;
	return (isCriticalHitOrMiss ? 'Critical ' : '') + (state.isHit ? "Hit" : "Miss");
}

export function GetHitStatusColorClass(state: GloomStalkerAttackState): string {
	const highestRoll = GetHighestHitRoll(state);

	if (highestRoll === 20) {
		return 'text-blue-500';
	}

	if (state.isHit) {
		return 'text-green-500';
	}

	return 'text-red-500';
}

export function GetHitPreConfirmStatusColorClass(state: GloomStalkerAttackState): string {
	const highestRoll = GetHighestHitRoll(state);

	if (highestRoll === 20) {
		return 'text-blue-500';
	}

	if (highestRoll === 1) {
		return 'text-red-500';
	}

	return 'text-green-500';
}

export function GetFavoredEnemyBonus(state: GloomStalkerAttackState): number {
	return state.selectedFavoredEnemies.length * 2;
}

export function FormatHitValueBreakdown(state: GloomStalkerAttackState): string {
	const highestHitRoll = GetHighestHitRoll(state);
	const totalHitValue = GetHighestHitValue(state);
	const favoredEnemyBonus = GetFavoredEnemyBonus(state);
	const { attackModifier } = state.gloomStalkerInfo;

	return `${totalHitValue} (${highestHitRoll} + ${attackModifier}`
		+ (state.applySharpShooterPenalty ? ' - 5' : '')
		+ (favoredEnemyBonus > 0 ? ` + ${favoredEnemyBonus}` : '')
		+ ')';
}

export function GetHighestHitValue(state: GloomStalkerAttackState): number {
	const highestRoll = GetHighestHitRoll(state);
	const modifier = state.gloomStalkerInfo.attackModifier + (state.applySharpShooterPenalty ? -5 : 0) + GetFavoredEnemyBonus(state);
	return highestRoll + modifier;
}

export function GetTotalPiercingDamage(state: GloomStalkerAttackState): number {
	return state.piercingDamageRolls.reduce((a, value) => a + value, 0)
		+ state.gloomStalkerInfo.damageModifier
		+ (state.applySharpShooterPenalty ? 10 : 0)
		+ GetFavoredEnemyBonus(state);
}

export function GetTotalFireDamage(state: GloomStalkerAttackState): number {
	return state.fireDamageRolls.reduce((a, value) => a + value, 0);
}

export function GetTotalForceDamage(state: GloomStalkerAttackState): number {
	return state.forceDamageRolls.reduce((a, value) => a + value, 0);
}

export function GetTotalDamage(state: GloomStalkerAttackState): number {
	return GetTotalPiercingDamage(state) + GetTotalFireDamage(state) + GetTotalForceDamage(state);
}

export function RollHitDice(hasAdvantage: boolean, rng: () => number = Math.random): number[] {
	// elven accuracy allows you to roll an additional die when you have advantage, and pick the highest.
	// effectively giving you one extra die to roll when you have advantage.
	const numberOfDice = hasAdvantage ? 3 : 1;
	const rolls: number[] = [];
	for (let i = 0; i < numberOfDice; i++) {
		rolls.push(RollDie(20, rng));
	}

	return rolls;
}

export function GetPiercingDamageDicePool(state: GloomStalkerAttackState): number[] {
	const {
		isDreadAmbusherExtraAttack,
	} = state;

	const {
		damageDie
	} = state.gloomStalkerInfo;

	const isCriticalHit = GetCritStatus(state) === CritStatus.CriticalHit;

	const piercingDamageDicePool: number[] = [];

	// Base Weapon Attack
	piercingDamageDicePool.push(damageDie);

	// Dread Ambusher Bonus: If it's the first turn of combat, and the attack is the first attack of the turn, then Dread Ambusher adds an additional weapon damage
	if (isDreadAmbusherExtraAttack) {
		piercingDamageDicePool.push(damageDie);
	}

	if (isCriticalHit) {
		// on a critical hit, you roll all of the attack's damage dice an additional time
		piercingDamageDicePool.push(...piercingDamageDicePool);

		// Piercer adds additonal weapon damage on crit
		piercingDamageDicePool.push(damageDie);
	}

	return piercingDamageDicePool;
}

export function GetFireDamageDicePool(state: GloomStalkerAttackState): number[] {
	const isCriticalHit = GetCritStatus(state) === CritStatus.CriticalHit;

	const fireDamageDicePool: number[] = [];

	fireDamageDicePool.push(6);   // Dragon's Wrath Longbow Stirrings adds 1d6 damage on hit

	if (isCriticalHit) {
		fireDamageDicePool.push(...fireDamageDicePool);   // on a critical hit, you roll all of the attack's damage dice an additional time
	}

	return fireDamageDicePool;
}

export function FormatDieRolls(rolls: number[], dicePool: number[]): string {
	return rolls.map((roll, index) => `d${dicePool[index]}->${roll}`).join(', ');
}

export function GetIsAlreadyBestRolls(state: GloomStalkerAttackState): boolean {
	return GetBestRerollOption(state) === null;
}

export function GetRerollButtonText(state: GloomStalkerAttackState): string {
	if (state.hasUsedReroll) {
		return "Reroll Used";
	}

	const bestRerollOption = GetBestRerollOption(state);
	if (bestRerollOption === null) {
		return "Already best rolls!";
	}

	return `Reroll Lowest Damage Roll? (d${bestRerollOption.dieSize}->${bestRerollOption.roll})`;
}

export function GetForceDamageDicePool(state: GloomStalkerAttackState): number[] {
	const { applyHuntersMark } = state;

	const isCriticalHit = GetCritStatus(state) === CritStatus.CriticalHit;

	const forceDamageDicePool: number[] = [];

	if (applyHuntersMark) {
		forceDamageDicePool.push(6);   // Hunter's Mark adds 1d6 Force damage on hit
	}

	if (isCriticalHit) {
		forceDamageDicePool.push(...forceDamageDicePool);   // on a critical hit, you roll all of the attack's damage dice an additional time
	}

	return forceDamageDicePool;
}