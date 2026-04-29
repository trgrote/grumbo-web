export interface GloomStalkerInfo {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	hasDreadAmbusher: boolean;
	hasStalkersFlurry: boolean;
	hasSharpShooter: boolean;
	hasPiercer: boolean;
	hasElvenAccuracy: boolean;
	hasDragonsWrathLongbowStirring: boolean;
}

export enum AttackState {
	PreHitRoll,
	PostHitRoll,
	PreDamageRoll,
	PostDamageRoll
}

export interface PreHitRollInfo {
	hasAdvantage: boolean;
	applySharpShooterPenalty: boolean;   // apply -5 to hit to get +10 damage?
}

export interface PostHitRollInfo {
	attackRolls: number[];    // pre-modifier attack roll values
	isHit: boolean;
}

export interface PreDamageRollInfo {
	isDreadAmbusherExtraAttack: boolean;   // if it's the first turn of combat, and the attack is the first attack of the turn, then Dread Ambusher adds an additional 1d8 damage
}

export interface PostDamageRollInfo {
	rerollPiercingDamageDieIndex: number | null;
	piercingDamageRolls: number[];
	applyDragonSlumberDamage: boolean;  // apply 5 damage to nearby creatures? Only triggered on crit
}

export interface RollHistoryRecord {
	timestamp: number;
	gloomStalkerInfo: GloomStalkerInfo;
}

export enum AttackSheetActionType {
	Reset,
	SetAdvantage,
	SetApplySharpShooterPenalty,
	RollForAttack,
	ConfirmIsHit,
	ConfirmIsMiss,
	SetIsDreadAmbusherExtraAttack,
	RollForDamage,
	RerollPiercingDamageDie,
	GoBack,
}

export enum AttackStep {
	PreHitRoll,
	PostHitRoll,
	PreDamageRoll,
	PostDamageRoll,
	Results
}