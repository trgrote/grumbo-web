import { AttackInfo, AttackRollResult, RollDamageInfo, RollDamageResult } from "./PaladinTypes";

export function RollAttack(attackInfo: AttackInfo): AttackRollResult {
	const { hasAdvantage, attackModifier } = attackInfo;

	// Perform Attack Rolls
	const numAttackRolls = hasAdvantage ? 2 : 1;
	const toHitValues = Array.from(
		{ length: numAttackRolls },
		() => Math.ceil(Math.random() * 20) + attackModifier
	);
	const isCritical = toHitValues.some((value) => value - attackModifier === 20);

	return {
		toHitValues,
		isCritical
	};
}

export function RollDamage(info: RollDamageInfo): RollDamageResult {
	const { isCritical, damageDie, damageModifier, hasImprovedDS, isTargetFiendOrUndead, spellSlotUsed } = info;

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
		(isTargetFiendOrUndead ? 1 : 0) +
		(spellSlotUsed > 0 ? spellSlotUsed + 1 : 0)
	);
	const divineSmiteDamageRolls = Array.from(
		{ length: numDivineSmiteDamageRolls },
		() => Math.ceil(Math.random() * divineSmiteDamageDie)
	);

	return {
		weaponDamageRolls,
		divineSmiteDamageRolls
	};
}