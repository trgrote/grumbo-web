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