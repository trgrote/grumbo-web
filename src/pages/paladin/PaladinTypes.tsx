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
export interface HistoryRecord extends PaladinAttackState {
	attackStep: AttackStep;
	timestamp: number;
}

export enum CritStatus {
	CriticalHit,
	CriticalMiss,
	Normal
}
