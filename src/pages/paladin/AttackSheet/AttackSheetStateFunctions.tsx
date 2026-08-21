import { AttackStep, CritStatus, HistoryRecord, PaladinAttackSheetState, PaladinInfo } from "../PaladinTypes";
import { RollDie } from "@/utils/Dice";

export function PaladinAttackSheetStateDefault(paladinInfo: PaladinInfo): PaladinAttackSheetState {
	return {
		paladinInfo: { ...paladinInfo },
		attackStep: AttackStep.PreAttackRoll,
		hasAdvantage: false,
		attackRolls: [],
		isHit: false,
		isTargetFiendOrUndead: false,
		spellSlotUsed: 0,
		weaponDamageRolls: [],
		divineSmiteDamageRolls: [],
	};
}

export function CreateHistoryRecordFromState(state: PaladinAttackSheetState, now: () => number = Date.now): HistoryRecord {
	return {
		...state,
		paladinInfo: { ...state.paladinInfo },   // force a shallow copy of paladinInfo to prevent mutation issues
		timestamp: now()
	};
}

export function GetHighestAttackRoll(state: PaladinAttackSheetState): number {
	return Math.max(...state.attackRolls);
}

export function GetCritStatus(state: PaladinAttackSheetState): CritStatus {
	const highestRoll = GetHighestAttackRoll(state);

	if (highestRoll === 20) {
		return CritStatus.CriticalHit;
	}
	if (highestRoll === 1) {
		return CritStatus.CriticalMiss;
	}
	return CritStatus.Normal;
}

export function GetIsCritical(state: PaladinAttackSheetState): boolean {
	return GetCritStatus(state) === CritStatus.CriticalHit;
}

export function GetHighestAttackValue(state: PaladinAttackSheetState): number {
	return GetHighestAttackRoll(state) + state.paladinInfo.attackModifier;
}

export function GetHitStatusText(state: PaladinAttackSheetState): string {
	const critStatus = GetCritStatus(state);

	const isCriticalHitOrMiss = critStatus !== CritStatus.Normal;
	return (isCriticalHitOrMiss ? 'Critical ' : '') + (state.isHit ? 'Hit' : 'Miss');
}

export function GetHitStatusColorClass(state: PaladinAttackSheetState): string {
	if (GetIsCritical(state)) {
		return 'text-blue-500';
	}

	if (state.isHit) {
		return 'text-green-500';
	}

	return 'text-red-500';
}

export function GetHitPreConfirmStatusColorClass(state: PaladinAttackSheetState): string {
	return GetIsCritical(state) ? 'text-blue-500' : 'text-green-500';
}

export function GetTotalWeaponDamage(state: PaladinAttackSheetState): number {
	return state.weaponDamageRolls.reduce((a, value) => a + value, 0) + state.paladinInfo.damageModifier;
}

export function GetTotalDivineSmiteDamage(state: PaladinAttackSheetState): number {
	return state.divineSmiteDamageRolls.reduce((a, value) => a + value, 0);
}

export function GetTotalDamage(state: PaladinAttackSheetState): number {
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

export function GetWeaponDamageDicePool(state: PaladinAttackSheetState): number[] {
	const numWeaponDamageRolls = GetIsCritical(state) ? 2 : 1;
	return Array.from({ length: numWeaponDamageRolls }, () => state.paladinInfo.damageDie);
}

export function GetDivineSmiteDamageDicePool(state: PaladinAttackSheetState): number[] {
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
