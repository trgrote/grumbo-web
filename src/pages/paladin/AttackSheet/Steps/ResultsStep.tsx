import { AttackAgainButton, AttackSheetStep } from "@/attackSheet/Steps/AttackSheetSteps";
import { PaladinAttackSheetState } from "../../PaladinTypes";
import { CreateHistoryRecordFromState } from "../AttackSheetStateFunctions";
import AttackHistoryDetails from "../../AttackHistoryDetails";
import { IPalAttackSheetCommand } from "../Commands/AttackSheetCommands";

interface ResultsStepProps {
	state: PaladinAttackSheetState;
	dispatch: React.Dispatch<IPalAttackSheetCommand>;
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
