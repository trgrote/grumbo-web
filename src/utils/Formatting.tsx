import { cloneElement, JSX } from "react";

export function RollArrayToString(arr: number[]): string {
	return '[' + arr.join(', ') + ']';
}

export function JoinWithElement(arr: JSX.Element[], element: JSX.Element): JSX.Element[] {
	return arr.flatMap((item, index) =>
		index < arr.length - 1 ? [item, cloneElement(element, { key: `separator-${index}` })] : [item]
	);
}
