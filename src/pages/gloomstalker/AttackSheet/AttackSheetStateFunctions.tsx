import { GloomStalkerInfo, GloomStalkerAttackSheetState, AttackStep, HistoryRecord, HitRollStatus } from "../GloomStalkerTypes";

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

export function GetHitCritStatus(state: GloomStalkerAttackSheetState): HitRollStatus {
	const highestRoll = GetHighestHitRoll(state);

	if (highestRoll === 20) {
		return HitRollStatus.CriticalHit;
	}
	if (highestRoll === 1) {
		return HitRollStatus.CriticalMiss;
	}
	return HitRollStatus.Normal;
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

export function GetHighestHitValue(state: GloomStalkerAttackSheetState): number {
	const highestRoll = GetHighestHitRoll(state);
	const modifier = state.gloomStalkerInfo.attackModifier + (state.applySharpShooterPenalty ? -5 : 0);
	return highestRoll + modifier;
}

export function IsCriticalHitOrMiss(state: GloomStalkerAttackSheetState): boolean {
	const highestRoll = GetHighestHitRoll(state);
	return highestRoll === 20 || highestRoll === 1;
}