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

export function Roll(attackInfo: AttackInfo): RollResult {
	const { hasAdvantage, attackModifier, damageDie, damageModifier, hasImprovedDS, spellSlotUsed } = attackInfo;

	// Perform Attack Rolls
	const numAttackRolls = hasAdvantage ? 2 : 1;
	const attackRolls = Array.from(
		{ length: numAttackRolls },
		() => Math.ceil(Math.random() * 20) + attackModifier
	);
	const isCritical = attackRolls.some((value) => value - attackModifier === 20);

	// Perform Weapon Damage
	const numWeaponDamageRolls = isCritical ? 2 : 1;
	const weaponDamageRolls = Array.from(
		{ length: numWeaponDamageRolls },
		() => Math.ceil(Math.random() * damageDie) + damageModifier
	);

	// Perform Divine Smite Damage Rolls
	const divineSmiteDamageDie = 8;

	const numDivineSmiteDamageRolls = (isCritical ? 2 : 1) * (
		(hasImprovedDS ? 1 : 0) +
		(spellSlotUsed > 0 ? spellSlotUsed + 1 : 0)
	);
	const divineSmiteDamageRolls = Array.from(
		{ length: numDivineSmiteDamageRolls },
		() => Math.ceil(Math.random() * divineSmiteDamageDie)
	);

	// Perform Damage Rolls
	return {
		attackRolls,
		isCritical,
		weaponDamageRolls,
		divineSmiteDamageRolls
	};
}