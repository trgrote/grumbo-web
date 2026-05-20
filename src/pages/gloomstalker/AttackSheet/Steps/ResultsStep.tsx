import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { CreateHistoryRecordFromState } from "../AttackSheetStateFunctions";
import AttackHistoryDetails from "../../AttackHistoryDetails";
import IGSAttackSheetCommand from "../Commands/IGSAttackSheetCommand";
import AttackAgainCommand from "../Commands/AttackAgainCommand";

interface ResultsStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<IGSAttackSheetCommand>;
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