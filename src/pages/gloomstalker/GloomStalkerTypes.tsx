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

export interface PreAttackInfo {
	hasAdvantage: boolean;
	applySharpShooterPenalty: boolean;   // apply -5 to hit to get +10 damage?
}

export interface AttackResult {
	attackRolls: number[];    // pre-modifier attack roll values
}

export interface PostDamageInfo {
	rerollPiercingDamageDieIndex: number | null;
}

export interface DamageResult {
	piercingDamageRolls: number[];
	applyDragonSlumberDamage: boolean;  // apply 5 damage to nearby creatures? Only triggered on crit
}

export interface RollHistoryRecord {
	timestamp: number;
}