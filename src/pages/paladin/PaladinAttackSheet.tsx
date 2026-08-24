import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JSX, useEffect, useMemo, useReducer } from "react";
import { AttackStep, HistoryRecord, PaladinInfo } from "./PaladinTypes";
import { CreateAttackSheetReducer } from "@/attackSheet/AttackSheetStateReducer";
import { CreateInitialState, GetFinalStep } from "@/attackSheet/AttackSheetStateFunctions";
import PaladinAttackModel from "./AttackSheet/PaladinAttackModel";
import PreAttackRollStep from "./AttackSheet/Steps/PreAttackRollStep";
import PostAttackRollStep from "./AttackSheet/Steps/PostAttackRollStep";
import PreDamageRollStep from "./AttackSheet/Steps/PreDamageRollStep";
import ResultsStep from "./AttackSheet/Steps/ResultsStep";
import { CreateHistoryRecordFromState, GetIsCritical } from "./AttackSheet/AttackSheetStateFunctions";
import { ResetCommand } from "./AttackSheet/Commands/AttackSheetCommands";
import { usePaladinSound } from "./hooks/usePaladinSound";

export interface PaladinAttackSheetProps {
	paladinInfo: PaladinInfo;
	addToRollHistory: (result: HistoryRecord) => void;
}

export default function PaladinAttackSheet({ paladinInfo, addToRollHistory }: PaladinAttackSheetProps) {
	const model = useMemo(() => new PaladinAttackModel(paladinInfo), [paladinInfo]);
	const reducer = useMemo(() => CreateAttackSheetReducer(model), [model]);

	const [state, dispatch] = useReducer(
		reducer,
		model,
		CreateInitialState
	);

	const playRandomPaladinSound = usePaladinSound();

	// I have to disable the exhaustive-deps rule here because
	// I only want to trigger this effect when the attack step changes to results,
	// not on every state change.
	useEffect(() => {
		if (state.attackStep === GetFinalStep(model)) {
			const historyRecord = CreateHistoryRecordFromState(state);
			addToRollHistory(historyRecord);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.attackStep]);

	// Same reasoning as above: only fire once, exactly when we land on PostAttackRoll with a crit.
	useEffect(() => {
		if (state.attackStep === AttackStep.PostAttackRoll && GetIsCritical(state.characterState)) {
			playRandomPaladinSound();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.attackStep]);

	const resetSheet = (): void => {
		dispatch(new ResetCommand());
	};

	useEffect(resetSheet, [model]);

	const renderSheetContent = (): JSX.Element => {
		return (
			<>
				{state.attackStep === AttackStep.PreAttackRoll && <PreAttackRollStep
					state={state}
					dispatch={dispatch}
				/>}
				{state.attackStep === AttackStep.PostAttackRoll && <PostAttackRollStep
					state={state}
					dispatch={dispatch}
				/>}
				{state.attackStep === AttackStep.PreDamageRoll && <PreDamageRollStep
					state={state}
					dispatch={dispatch}
				/>}
				{state.attackStep === AttackStep.Results && <ResultsStep
					state={state}
					dispatch={dispatch}
				/>}
			</>
		);
	};

	return (
		<Sheet onOpenChange={(open) => { if (!open) resetSheet(); }}>
			<SheetTrigger asChild>
				<Button>Roll for Attack</Button>
			</SheetTrigger>
			<SheetContent className="dark bg-background text-neutral-300">
				{renderSheetContent()}
			</SheetContent>
		</Sheet>
	);
}
