import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PaladinAttackSheetState } from "../../PaladinTypes";
import {
	IPalAttackSheetCommand,
	SetAdvantageCommand,
	RollForAttackCommand
} from "../Commands/AttackSheetCommands";

interface PreAttackRollStepProps {
	state: PaladinAttackSheetState;
	dispatch: React.Dispatch<IPalAttackSheetCommand>;
}

export default function PreAttackRollStep({ state, dispatch }: PreAttackRollStepProps) {
	const hasAdvantage = state.hasAdvantage;
	const setHasAdvantage = (value: boolean) => dispatch(new SetAdvantageCommand(value));
	const onRollForAttack = () => dispatch(new RollForAttackCommand());

	return (
		<>
			<SheetHeader>
				<SheetTitle>Roll for Attack</SheetTitle>
				<SheetDescription>
					Provide Attack Information, roll for attack, provide damage information, and then roll for damage.
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<div className="grid gap-3">
					<Label htmlFor="hasAdvantage" className="flex items-center space-x-2">
						<Checkbox id="hasAdvantage" className="flex items-center space-x-2" checked={hasAdvantage}
							onCheckedChange={() => setHasAdvantage(!hasAdvantage)} />
						Has Advantage?
					</Label>
				</div>
			</div>
			<SheetFooter>
				<Button onClick={onRollForAttack} type="submit">Roll for Attack</Button>
			</SheetFooter>
		</>
	);
};
