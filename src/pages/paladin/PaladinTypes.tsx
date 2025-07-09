export interface PaladinInfo {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	hasImprovedDS: boolean;
}

export interface AttackInfo {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	hasAdvantage: boolean;
	hasImprovedDS: boolean;
	spellSlotUsed: number;
}

export interface RollResult {
	attackRolls: number[];
	isCritical: boolean;
	weaponDamageRolls: number[];
	divineSmiteDamageRolls: number[];
}