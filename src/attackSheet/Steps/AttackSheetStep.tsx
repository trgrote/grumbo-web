import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ReactNode } from "react";

export interface AttackSheetStepProps {
	title: string;
	description: string;

	// The step's footer buttons, in order. Put the action that advances the flow first.
	actions: ReactNode;

	// The step's body - the only part that's genuinely character-specific.
	children?: ReactNode;
}

// The shell every step of every character's attack sheet shares: a titled header, the body
// grid, and a footer for the actions. Steps supply the three pieces and nothing else, so
// they don't each re-derive the layout.
export default function AttackSheetStep({ title, description, actions, children }: AttackSheetStepProps) {
	return (
		<>
			<SheetHeader>
				<SheetTitle>{title}</SheetTitle>
				<SheetDescription>
					{description}
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				{children}
			</div>
			<SheetFooter>
				{actions}
			</SheetFooter>
		</>
	);
}
