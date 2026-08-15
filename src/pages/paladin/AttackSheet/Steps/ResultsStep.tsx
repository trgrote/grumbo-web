import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { PaladinAttackSheetState } from "../../PaladinTypes";
import { CreateHistoryRecordFromState } from "../AttackSheetStateFunctions";
import AttackHistoryDetails from "../../AttackHistoryDetails";
import {
	IPalAttackSheetCommand,
	AttackAgainCommand
} from "../Commands/AttackSheetCommands";

interface ResultsStepProps {
	state: PaladinAttackSheetState;
	dispatch: React.Dispatch<IPalAttackSheetCommand>;
}

export default function ResultsStep({ state, dispatch }: ResultsStepProps) {
	const rollAgain = () => dispatch(new AttackAgainCommand());
	const history = CreateHistoryRecordFromState(state);

	return (
		<>
			<SheetHeader>
				<SheetTitle>Results</SheetTitle>
				<SheetDescription>
					Attack and Damage Results
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<AttackHistoryDetails
					historyRecord={history}
				/>
			</div>
			<SheetFooter>
				<Button onClick={rollAgain} type="submit">Attack Again</Button>
			</SheetFooter>
		</>
	);
}
