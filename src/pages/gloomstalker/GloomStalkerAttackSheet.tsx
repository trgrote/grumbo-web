import AttackSheet, { AttackStepComponents } from "@/attackSheet/AttackSheet";
import { AttackStep, GloomStalkerAttackState, GloomStalkerInfo, HistoryRecord } from "./GloomStalkerTypes";
import GloomStalkerAttackModel from "./AttackSheet/GloomStalkerAttackModel";
import PreAttackRollStep from "./AttackSheet/Steps/PreAttackRollStep";
import PostAttackRollStep from "./AttackSheet/Steps/PostAttackRollStep";
import PreDamageRollStep from "./AttackSheet/Steps/PreDamageRollStep";
import PostDamageRollStep from "./AttackSheet/Steps/PostDamageRollStep";
import ResultsStep from "./AttackSheet/Steps/ResultsStep";
import { CreateHistoryRecordFromState } from "./AttackSheet/AttackSheetStateFunctions";

// Mirrors GloomStalkerAttackModel.steps.
const gloomStalkerSteps: AttackStepComponents<GloomStalkerAttackState> = {
	[AttackStep.PreAttackRoll]: PreAttackRollStep,
	[AttackStep.PostAttackRoll]: PostAttackRollStep,
	[AttackStep.PreDamageRoll]: PreDamageRollStep,
	[AttackStep.PostDamageRoll]: PostDamageRollStep,
	[AttackStep.Results]: ResultsStep
};

export interface GloomStalkerAttackSheetProps {
	gloomStalkerInfo: GloomStalkerInfo;
	addToHistory: (historyRecord: HistoryRecord) => void;
}

export default function GloomStalkerAttackSheet({ gloomStalkerInfo, addToHistory }: GloomStalkerAttackSheetProps) {
	return (
		<AttackSheet
			info={gloomStalkerInfo}
			createModel={(info) => new GloomStalkerAttackModel(info)}
			steps={gloomStalkerSteps}
			onAttackComplete={(state) => addToHistory(CreateHistoryRecordFromState(state))}
		/>
	);
}
