import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import RollResultView from "../RollResultView";
import { RollHistoryRecord } from "../PaladinTypes";

interface ResultStateProps {
	currentHistoryResult: RollHistoryRecord;
	onAttackAgain: () => void;
}

export default function ResultState({ currentHistoryResult, onAttackAgain }: ResultStateProps) {
	return (
		<>
			<SheetHeader>
				<SheetTitle>Results</SheetTitle>
				<SheetDescription>
					Attack and Damage Results
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<RollResultView
					{...currentHistoryResult}
					defaultOpen
				/>
			</div>
			<SheetFooter>
				<Button onClick={onAttackAgain}>Attack Again</Button>
			</SheetFooter>
		</>
	);
}