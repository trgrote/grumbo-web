import { GloomStalkerInfo, GloomStalkerAttackSheetState, AttackStep, HistoryRecord, CritStatus } from "../GloomStalkerTypes";

export function GloomStalkerAttackSheetStateDefault(gloomStalkerInfo: GloomStalkerInfo): GloomStalkerAttackSheetState {
	return {
		gloomStalkerInfo: { ...gloomStalkerInfo },
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

export interface RolledDie {
	dieSize: number;
	roll: number;
	type: string;
	dicePoolIndex: number;
}

// Select the best die to reroll. 
// The best die to reroll is the one that has the lowest value. 
// Tiebreaker goes to the highest die (e.g. it's better to reroll a 1 on a d12 than a 1 on a d6)
export function GetBestRerollOption(state: GloomStalkerAttackSheetState): RolledDie {
	const allRolls: RolledDie[] = [
		...state.piercingDamageRolls.map((roll, i) => ({ roll, dieSize: state.piercingDamageDicePool[i], type: 'piercing', dicePoolIndex: i })),
		...state.fireDamageRolls.map((roll, i) => ({ roll, dieSize: state.fireDamageDicePool[i], type: 'fire', dicePoolIndex: i }))
	];

	const rerollableRolls = allRolls.filter(r => r.roll < r.dieSize);

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
	}, { dieSize: 0, roll: Infinity, type: '', dicePoolIndex: -1 });
}

export function CreateHistoryRecordFromState(state: GloomStalkerAttackSheetState): HistoryRecord {
	return {
		...state,
		gloomStalkerInfo: { ...state.gloomStalkerInfo },   // force a shallow copy of the gloomStalkerInfo to prevent mutation issues
		timestamp: Date.now()
	};
}

export function GetHighestHitRoll(state: GloomStalkerAttackSheetState): number {
	// TODO If we add disadvantage, we need to select the lowest instead of the highest
	return Math.max(...state.attackRolls);
}

export function GetCritStatus(state: GloomStalkerAttackSheetState): CritStatus {
	const highestRoll = GetHighestHitRoll(state);

	if (highestRoll === 20) {
		return CritStatus.CriticalHit;
	}
	if (highestRoll === 1) {
		return CritStatus.CriticalMiss;
	}
	return CritStatus.Normal;
}

export function GetHitStatusText(state: GloomStalkerAttackSheetState): string {
	const highestRoll = GetHighestHitRoll(state);

	const isCriticalHitOrMiss = highestRoll === 20 || highestRoll === 1;
	return (isCriticalHitOrMiss ? 'Critical ' : '') + (state.isHit ? "Hit" : "Miss");
}

export function GetHitStatusColorClass(state: GloomStalkerAttackSheetState): string {
	const highestRoll = GetHighestHitRoll(state);

	if (highestRoll === 20) {
		return 'text-blue-500';
	}

	if (state.isHit) {
		return 'text-green-500';
	}

	return 'text-red-500';
}

export function GetHitPreConfirmStatusColorClass(state: GloomStalkerAttackSheetState): string {
	const highestRoll = GetHighestHitRoll(state);

	if (highestRoll === 20) {
		return 'text-blue-500';
	}

	if (highestRoll === 1) {
		return 'text-red-500';
	}

	return 'text-green-500';
}

export function GetHighestHitValue(state: GloomStalkerAttackSheetState): number {
	const highestRoll = GetHighestHitRoll(state);
	const modifier = state.gloomStalkerInfo.attackModifier + (state.applySharpShooterPenalty ? -5 : 0);
	return highestRoll + modifier;
}

export function RollDie(sides: number): number {
	return Math.floor(Math.random() * sides) + 1;
}

export function RollDice(dicePool: number[]): number[] {
	return dicePool.map(sides => RollDie(sides));
}

export function RollHitDice(hasAdvantage: boolean): number[] {
	// elven accuracy allows you to roll an additional die when you have advantage, and pick the highest. 
	// effectively giving you one extra die to roll when you have advantage.
	const numberOfDice = hasAdvantage ? 3 : 1;
	const rolls: number[] = [];
	for (let i = 0; i < numberOfDice; i++) {
		rolls.push(RollDie(20));
	}

	return rolls;
}

export function GetPiercingDamageDicePool(state: GloomStalkerAttackSheetState): number[] {
	const {
		isDreadAmbusherExtraAttack,
		applyHuntersMark,
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

	if (applyHuntersMark) {
		piercingDamageDicePool.push(6);   // Hunter's Mark adds 1d6 damage on hit
	}

	if (isCriticalHit) {
		// on a critical hit, you roll all of the attack's damage dice an additional time
		piercingDamageDicePool.push(...piercingDamageDicePool);

		// Piercer adds additonal weapon damage on crit
		piercingDamageDicePool.push(damageDie);
	}

	return piercingDamageDicePool;
}

export function GetFireDamageDicePool(state: GloomStalkerAttackSheetState): number[] {
	const isCriticalHit = GetCritStatus(state) === CritStatus.CriticalHit;;

	const fireDamageDicePool: number[] = [];

	fireDamageDicePool.push(6);   // Dragon's Wrath Longbow Stirrings adds 1d6 damage on hit

	if (isCriticalHit) {
		fireDamageDicePool.push(...fireDamageDicePool);   // on a critical hit, you roll all of the attack's damage dice an additional time
	}

	return fireDamageDicePool;
}