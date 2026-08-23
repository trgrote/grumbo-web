import { AttackSheetState, AttackStep } from "@/attackSheet/AttackSheetTypes";

// Re-exported so the rest of the Gloom Stalker page keeps a single import site for the flow's steps.
export { AttackStep };

export interface GloomStalkerInfo {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	favoredEnemies: string[];
}

export interface PreAttackRollInfo {
	hasAdvantage: boolean;
	applySharpShooterPenalty: boolean;   // apply -5 to hit to get +10 damage?
	selectedFavoredEnemies: string[];   // which of gloomStalkerInfo.favoredEnemies apply to this attack's target (+2 to hit/damage each, stacking)
}

export interface PostAttackRollInfo {
	attackRolls: number[];    // pre-modifier attack roll values
	isHit: boolean;
}

export interface PreDamageRollInfo {
	isDreadAmbusherExtraAttack: boolean;   // if it's the first turn of combat, and the attack is the first attack of the turn, then Dread Ambusher adds an additional 1d8 damage
	applyHuntersMark: boolean;  // apply Hunter's Mark damage?
}

export interface PostDamageRollInfo {
	piercingDamageDicePool: number[];
	piercingDamageRolls: number[];
	fireDamageDicePool: number[];
	fireDamageRolls: number[];
	forceDamageDicePool: number[];
	forceDamageRolls: number[];
}

// Everything the Gloom Stalker's own rules care about. The shared attack sheet flow owns
// the attack step and knows nothing about any of this.
export interface GloomStalkerAttackState extends PreAttackRollInfo, PostAttackRollInfo, PreDamageRollInfo, PostDamageRollInfo {
	gloomStalkerInfo: GloomStalkerInfo;
	hasUsedReroll: boolean;
}

export type GloomStalkerAttackSheetState = AttackSheetState<GloomStalkerAttackState>;

// Deliberately flat (rather than mirroring the nested sheet state) so records persisted by
// earlier versions keep deserializing - see GloomStalkerLocalStorage's storageVersion.
export interface HistoryRecord extends GloomStalkerAttackState {
	attackStep: AttackStep;
	timestamp: number;
}

export enum CritStatus {
	CriticalHit,
	CriticalMiss,
	Normal
}

export enum DamageType {
	Piercing = 'piercing',
	Fire = 'fire',
	Force = 'force'
}
