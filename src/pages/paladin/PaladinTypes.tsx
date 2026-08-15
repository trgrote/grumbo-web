export interface PaladinInfo {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	hasImprovedDS: boolean;
}

export enum AttackStep {
	PreAttackRoll,
	PostAttackRoll,
	PreDamageRoll,
	Results
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

export interface PaladinAttackSheetState extends PreAttackRollInfo, PostAttackRollInfo, PreDamageRollInfo, PostDamageRollInfo {
	attackStep: AttackStep;
	paladinInfo: PaladinInfo;
}

export interface HistoryRecord extends PaladinAttackSheetState {
	timestamp: number;
}
