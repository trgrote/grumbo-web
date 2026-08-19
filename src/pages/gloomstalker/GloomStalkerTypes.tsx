export interface GloomStalkerInfo {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	favoredEnemies: string[];
}

export interface PreHitRollInfo {
	hasAdvantage: boolean;
	applySharpShooterPenalty: boolean;   // apply -5 to hit to get +10 damage?
	selectedFavoredEnemies: string[];   // which of gloomStalkerInfo.favoredEnemies apply to this attack's target (+2 to hit/damage each, stacking)
}

export interface PostHitRollInfo {
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

export enum AttackStep {
	PreHitRoll,
	PostHitRoll,
	PreDamageRoll,
	PostDamageRoll,
	Results
}

export interface GloomStalkerAttackSheetState extends PreHitRollInfo, PostHitRollInfo, PreDamageRollInfo, PostDamageRollInfo {
	attackStep: AttackStep;
	gloomStalkerInfo: GloomStalkerInfo;
	hasUsedReroll: boolean;
}

export interface HistoryRecord extends GloomStalkerAttackSheetState {
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