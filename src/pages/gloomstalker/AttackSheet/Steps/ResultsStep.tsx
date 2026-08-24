import { AttackAgainButton, AttackSheetStep } from "@/attackSheet/Steps/AttackSheetSteps";
import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { CreateHistoryRecordFromState } from "../AttackSheetStateFunctions";
import AttackHistoryDetails from "../../AttackHistoryDetails";
import { IGSAttackSheetCommand } from "../Commands/AttackSheetCommands";

interface ResultsStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<IGSAttackSheetCommand>;
}

export default function ResultsStep({ state, dispatch }: ResultsStepProps) {
	const history = CreateHistoryRecordFromState(state);

	return (
		<AttackSheetStep
			title="Results"
			description="Attack and Damage Results"
			actions={<AttackAgainButton dispatch={dispatch} />}
		>
			<AttackHistoryDetails
				historyRecord={history}
			/>
		</AttackSheetStep>
	);
}
