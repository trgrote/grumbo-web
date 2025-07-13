export interface PaladinInfo {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	hasImprovedDS: boolean;
}

export interface AttackInfo {
	attackModifier: number;
	hasAdvantage: boolean;
}

export interface AttackRollResult {
	toHitValues: number[];
	isCritical: boolean;
}

export interface RollDamageInfo {
	isCritical: boolean;
	damageDie: number;
	damageModifier: number;
	hasImprovedDS: boolean;
	isTargetFiendOrUndead: boolean;
	spellSlotUsed: number;
}

export interface RollDamageResult {
	weaponDamageRolls: number[];
	divineSmiteDamageRolls: number[];
}

export interface RollHistoryRecord extends PaladinInfo, AttackInfo, AttackRollResult, RollDamageInfo, RollDamageResult {
	isHit: boolean;
}

// Stored Local Data
export interface PaladinLocalStorage {
	storageVersion?: string;    // storage version so we don't end up trying to parse incomptable old storage
	paladinInfo: PaladinInfo;
	attackResults: RollHistoryRecord[];
}