import AttackSheet, { AttackStepComponents } from "@/attackSheet/AttackSheet";
import { AttackStep, HistoryRecord, PaladinAttackState, PaladinInfo } from "./PaladinTypes";
import PaladinAttackModel from "./AttackSheet/PaladinAttackModel";
import PreAttackRollStep from "./AttackSheet/Steps/PreAttackRollStep";
import PostAttackRollStep from "./AttackSheet/Steps/PostAttackRollStep";
import PreDamageRollStep from "./AttackSheet/Steps/PreDamageRollStep";
import ResultsStep from "./AttackSheet/Steps/ResultsStep";
import { CreateHistoryRecordFromState, GetIsCritical } from "./AttackSheet/AttackSheetStateFunctions";
import { usePaladinSound } from "./hooks/usePaladinSound";

// Mirrors PaladinAttackModel.steps - no PostDamageRoll, so nothing renders one.
const paladinSteps: AttackStepComponents<PaladinAttackState> = {
	[AttackStep.PreAttackRoll]: PreAttackRollStep,
	[AttackStep.PostAttackRoll]: PostAttackRollStep,
	[AttackStep.PreDamageRoll]: PreDamageRollStep,
	[AttackStep.Results]: ResultsStep
};

export interface PaladinAttackSheetProps {
	paladinInfo: PaladinInfo;
	addToRollHistory: (result: HistoryRecord) => void;
}

export default function PaladinAttackSheet({ paladinInfo, addToRollHistory }: PaladinAttackSheetProps) {
	const playRandomPaladinSound = usePaladinSound();

	return (
		<AttackSheet
			info={paladinInfo}
			createModel={(info) => new PaladinAttackModel(info)}
			steps={paladinSteps}
			onAttackComplete={(state) => addToRollHistory(CreateHistoryRecordFromState(state))}
			onStepEntered={(state) => {
				if (state.attackStep === AttackStep.PostAttackRoll && GetIsCritical(state.characterState)) {
					playRandomPaladinSound();
				}
			}}
		/>
	);
}
