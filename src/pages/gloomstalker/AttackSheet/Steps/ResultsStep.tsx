import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { AttackSheetActionType, GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { AttackSheetAction } from "../AttackSheetStateReducer";
import AttackHistoryView from "../../AttackHistoryView";
import { CreateHistoryRecordFromState } from "../AttackSheetStateFunctions";

interface ResultsStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<AttackSheetAction>;
}

export default function ResultsStep({ state, dispatch }: ResultsStepProps) {
	const rollAgain = () => dispatch({ type: AttackSheetActionType.Reset });
	const history = CreateHistoryRecordFromState(state);

	return (
		<>
			<SheetHeader>
				<SheetTitle>Roll for Attack</SheetTitle>
				<SheetDescription>
					Provide Attack Information, roll for attack, provide damage information, and then roll for damage.
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<AttackHistoryView
					historyRecord={history}
					defaultOpen
				/>
			</div>
			<SheetFooter>
				<Button onClick={rollAgain} type="submit">Attack Again</Button>
			</SheetFooter>
		</>
	);
}