import { cloneElement, JSX } from "react";

export function RollArrayToString(arr: number[]): string {
	return '[' + arr.join(', ') + ']';
}

export function DiceArrayToString(arr: number[]): string {
	return '[' + arr.map(die => `d${die}`).join(', ') + ']';
}

export function FormatSignedModifier(modifier: number): string {
	return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export type DetailSectionKey = 'hitSummary' | 'damageSummary' | 'toHitSummary' | 'damageRolls';

export function GetDetailSectionOrder(isHit: boolean): DetailSectionKey[] {
	const order: DetailSectionKey[] = ['hitSummary'];

	if (isHit) {
		order.push('damageSummary');
	}

	order.push('toHitSummary');

	if (isHit) {
		order.push('damageRolls');
	}

	return order;
}

export function JoinWithElement(arr: JSX.Element[], element: JSX.Element): JSX.Element[] {
	return arr.flatMap((item, index) =>
		index < arr.length - 1 ? [item, cloneElement(element, { key: `separator-${index}` })] : [item]
	);
}
