import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JSX, useEffect, useReducer } from "react";
import { AttackSheetActionType, AttackStep, GloomStalkerInfo, HistoryRecord } from "./GloomStalkerTypes";
import { AttackSheetStateReducer } from "./AttackSheet/AttackSheetStateReducer.tsx";
import PreHitRollStep from "./AttackSheet/Steps/PreHitRollStep.tsx";
import PostHitRollStep from "./AttackSheet/Steps/PostHitRollStep";
import PreDamageRollStep from "./AttackSheet/Steps/PreDamageRollStep";
import PostDamageRollStep from "./AttackSheet/Steps/PostDamageRollStep";
import { CreateHistoryRecordFromState, GloomStalkerAttackSheetStateDefault } from "./AttackSheet/AttackSheetStateFunctions";
import ResultsStep from "./AttackSheet/Steps/ResultsStep.tsx";

export interface GloomStalkerAttackSheetProps {
	gloomStalkerInfo: GloomStalkerInfo;
	addToHistory: (historyRecord: HistoryRecord) => void;
}

export default function GloomStalkerAttackSheet({ gloomStalkerInfo, addToHistory }: GloomStalkerAttackSheetProps) {
	const [state, dispatch] = useReducer(
		AttackSheetStateReducer,
		gloomStalkerInfo,
		GloomStalkerAttackSheetStateDefault
	);

	// I have to disable the exhaustive-deps rule here because 
	// I only want to trigger this effect when the attack step changes to results, 
	// not on every state change.
	useEffect(() => {
		if (state.attackStep === AttackStep.Results) {
			console.log("Attack Step Changed to Results");
			const historyRecord = CreateHistoryRecordFromState(state);
			addToHistory(historyRecord);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.attackStep]);

	const resetSheet = (): void => {
		dispatch({
			type: AttackSheetActionType.Reset
		});
	};

	const renderSheetContent = (): JSX.Element => {
		return (
			<>
				{state.attackStep === AttackStep.PreHitRoll && <PreHitRollStep
					state={state}
					dispatch={dispatch}
				/>}
				{state.attackStep === AttackStep.PostHitRoll && <PostHitRollStep
					state={state}
					dispatch={dispatch}
				/>}
				{state.attackStep === AttackStep.PreDamageRoll && <PreDamageRollStep
					state={state}
					dispatch={dispatch}
				/>}
				{state.attackStep === AttackStep.PostDamageRoll && <PostDamageRollStep
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