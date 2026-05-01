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

// Select the best die to reroll. 
// The best die to reroll is the one that has the lowest value. 
// Tiebreaker goes to the highest die (e.g. it's better to reroll a 1 on a d12 than a 1 on a d6)
export function GetBestRerollOption(state: GloomStalkerAttackSheetState): { die: number; currentValue: number; type: string; index: number; } {
	const allRolls = [
		...state.piercingDamageRolls.map((roll, i) => ({ roll, dieSize: state.piercingDamageDicePool[i], type: 'piercing', index: i })),
		...state.fireDamageRolls.map((roll, i) => ({ roll, dieSize: state.fireDamageDicePool[i], type: 'fire', index: i }))
	];

	return allRolls.reduce((best, current) => {
		if (current.roll < best.currentValue || (current.roll === best.currentValue && current.dieSize > best.die)) {
			return {
				die: current.dieSize,
				currentValue: current.roll,
				type: current.type,
				index: current.index
			};
		}
		return best;
	}, { die: 0, currentValue: Infinity, type: '', index: -1 });
}

export function CreateHistoryRecordFromState(state: GloomStalkerAttackSheetState): HistoryRecord {
	return {
		...state,
		gloomStalkerInfo: { ...state.gloomStalkerInfo },   // force a shallow copy of the gloomStalkerInfo to prevent mutation issues
		timestamp: Date.now()
	};
}