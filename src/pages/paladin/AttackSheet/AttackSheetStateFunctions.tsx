import { CritStatus, HistoryRecord, PaladinAttackSheetState, PaladinAttackState, PaladinInfo } from "../PaladinTypes";
import { RollDie } from "@/utils/Dice";

export function PaladinAttackStateDefault(paladinInfo: PaladinInfo): PaladinAttackState {
	return {
		paladinInfo: { ...paladinInfo },
		hasAdvantage: false,
		attackRolls: [],
		isHit: false,
		isTargetFiendOrUndead: false,
		spellSlotUsed: 0,
		weaponDamageRolls: [],
		divineSmiteDamageRolls: [],
	};
}

// Flattens the sheet state into the shape history has always been persisted in.
export function CreateHistoryRecordFromState(state: PaladinAttackSheetState, now: () => number = Date.now): HistoryRecord {
	return {
		...state.characterState,
		paladinInfo: { ...state.characterState.paladinInfo },   // force a shallow copy of the paladinInfo to prevent mutation issues
		timestamp: now()
	};
}

export function GetHighestAttackRoll(state: PaladinAttackState): number {
	return Math.max(...state.attackRolls);
}

export function GetCritStatus(state: PaladinAttackState): CritStatus {
	const highestRoll = GetHighestAttackRoll(state);

	if (highestRoll === 20) {
		return CritStatus.CriticalHit;
	}
	if (highestRoll === 1) {
		return CritStatus.CriticalMiss;
	}
	return CritStatus.Normal;
}

export function GetIsCritical(state: PaladinAttackState): boolean {
	return GetCritStatus(state) === CritStatus.CriticalHit;
}

export function GetHighestAttackValue(state: PaladinAttackState): number {
	return GetHighestAttackRoll(state) + state.paladinInfo.attackModifier;
}

export function GetHitStatusText(state: PaladinAttackState): string {
	const critStatus = GetCritStatus(state);

	const isCriticalHitOrMiss = critStatus !== CritStatus.Normal;
	return (isCriticalHitOrMiss ? 'Critical ' : '') + (state.isHit ? 'Hit' : 'Miss');
}

export function GetHitStatusColorClass(state: PaladinAttackState): string {
	if (GetIsCritical(state)) {
		return 'text-blue-500';
	}

	if (state.isHit) {
		return 'text-green-500';
	}

	return 'text-red-500';
}

export function GetHitPreConfirmStatusColorClass(state: PaladinAttackState): string {
	const critStatus = GetCritStatus(state);

	if (critStatus === CritStatus.CriticalHit) {
		return 'text-blue-500';
	}

	if (critStatus === CritStatus.CriticalMiss) {
		return 'text-red-500';
	}

	return 'text-green-500';
}

export function GetTotalWeaponDamage(state: PaladinAttackState): number {
	return state.weaponDamageRolls.reduce((a, value) => a + value, 0) + state.paladinInfo.damageModifier;
}

export function GetTotalDivineSmiteDamage(state: PaladinAttackState): number {
	return state.divineSmiteDamageRolls.reduce((a, value) => a + value, 0);
}

export function GetTotalDamage(state: PaladinAttackState): number {
	return GetTotalWeaponDamage(state) + GetTotalDivineSmiteDamage(state);
}

export function RollAttackDice(hasAdvantage: boolean, rng: () => number = Math.random): number[] {
	const numberOfDice = hasAdvantage ? 2 : 1;
	const rolls: number[] = [];
	for (let i = 0; i < numberOfDice; i++) {
		rolls.push(RollDie(20, rng));
	}

	return rolls;
}

export function GetWeaponDamageDicePool(state: PaladinAttackState): number[] {
	const numWeaponDamageRolls = GetIsCritical(state) ? 2 : 1;
	return Array.from({ length: numWeaponDamageRolls }, () => state.paladinInfo.damageDie);
}

export function GetDivineSmiteDamageDicePool(state: PaladinAttackState): number[] {
	const { hasImprovedDS } = state.paladinInfo;
	const { isTargetFiendOrUndead, spellSlotUsed } = state;

	const numDivineSmiteDamageRolls = (GetIsCritical(state) ? 2 : 1) * (
		(hasImprovedDS ? 1 : 0) +
		(isTargetFiendOrUndead ? 1 : 0) +
		(spellSlotUsed > 0 ? spellSlotUsed + 1 : 0)
	);

	return Array.from({ length: numDivineSmiteDamageRolls }, () => 8);
}

export function SpellSlotToString(spellSlotUsed: number): string {
	if (spellSlotUsed <= 0) {
		return "None";
	}

	if (spellSlotUsed >= 4) {
		return "4+";
	}

	return spellSlotUsed.toString();
}
