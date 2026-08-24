import { AttackSheetState, AttackStep } from "@/attackSheet/AttackSheetTypes";

// Re-exported so the rest of the Paladin page keeps a single import site for the flow's steps.
export { AttackStep };

export interface PaladinInfo {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	hasImprovedDS: boolean;
}

export interface PreAttackRollInfo {
	hasAdvantage: boolean;
}

export interface PostAttackRollInfo {
	attackRolls: number[];   // pre-modifier attack roll values
	isHit: boolean;
}

export interface PreDamageRollInfo {
	isTargetFiendOrUndead: boolean;
	spellSlotUsed: number;
}

export interface PostDamageRollInfo {
	weaponDamageRolls: number[];
	divineSmiteDamageRolls: number[];
}

// Everything the Paladin's own rules care about. The shared attack sheet flow owns
// the attack step and knows nothing about any of this.
export interface PaladinAttackState extends PreAttackRollInfo, PostAttackRollInfo, PreDamageRollInfo, PostDamageRollInfo {
	paladinInfo: PaladinInfo;
}

export type PaladinAttackSheetState = AttackSheetState<PaladinAttackState>;

// Deliberately flat (rather than mirroring the nested sheet state) so records persisted by
// earlier versions keep deserializing - see PaladinLocalStorage's storageVersion.
//
// Deliberately does NOT carry `attackStep`. A finished attack is always on the final step, so
// it was write-only data - and persisting it is a trap: the value is an enum ordinal, and the
// Paladin's own 4-value enum was replaced by the shared 5-value one, which silently reassigned
// 3 from Results to PostDamageRoll under every record already on disk.
export interface HistoryRecord extends PaladinAttackState {
	timestamp: number;
}

export enum CritStatus {
	CriticalHit,
	CriticalMiss,
	Normal
}
