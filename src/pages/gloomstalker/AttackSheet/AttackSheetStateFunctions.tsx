import { GloomStalkerInfo, GloomStalkerAttackSheetState, AttackStep, HistoryRecord } from "../GloomStalkerTypes";

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

// Determine which die has the greatest difference between the sides of the die and the rolled value. 
// For example, if there are two damage rolls of 4, but one is from a d8 and the other is from a d6, 
// then the d8 would be the best die to reroll because it has the potential to increase the damage by 4, 
// while the d6 can only increase the damage by 2. 
// If there are multiple dice with the same difference, prioritize rerolling the highest sided die.
export function GetBestRerollOption(state: GloomStalkerAttackSheetState): { die: number; currentValue: number; type: string; index: number; } {
	const allRolls = [
		...state.piercingDamageRolls.map((roll, i) => ({ roll, dieSize: state.piercingDamageDicePool[i], type: 'piercing', index: i })),
		...state.fireDamageRolls.map((roll, i) => ({ roll, dieSize: state.fireDamageDicePool[i], type: 'fire', index: i }))
	];

	return allRolls.reduce((best, current) => {
		const currentDifference = current.dieSize - current.roll;
		const bestDifference = best.die - best.currentValue;

		if (currentDifference > bestDifference || (currentDifference === bestDifference && current.dieSize > best.die)) {
			return {
				die: current.dieSize,
				currentValue: current.roll,
				type: current.type,
				index: current.index
			};
		}
		return best;
	}, { die: 0, currentValue: 0, type: '', index: -1 });
}

export function CreateHistoryRecordFromState(state: GloomStalkerAttackSheetState): HistoryRecord {
	return {
		...state,
		gloomStalkerInfo: { ...state.gloomStalkerInfo },   // force a shallow copy of the gloomStalkerInfo to prevent mutation issues
		timestamp: Date.now()
	};
}