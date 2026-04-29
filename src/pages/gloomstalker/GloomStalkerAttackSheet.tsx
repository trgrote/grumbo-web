import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JSX, useReducer, useState } from "react";
import { GloomStalkerInfo } from "./GloomStalkerTypes";
import { AttackSheetActionType, AttackStep, GloomStalkerAttackSheetStateDefault, GloomStalkerAttackSheetStateReducer } from "./GloomStalkerAttackSheetState";
import PreHitRollState from "./AttackSheetStates/PreHitRollState";

export interface GloomStalkerAttackSheetProps {
	gloomStalkerInfo: GloomStalkerInfo;
}

export default function GloomStalkerAttackSheet({ gloomStalkerInfo }: GloomStalkerAttackSheetProps) {
	const [state, dispatch] = useReducer(
		GloomStalkerAttackSheetStateReducer,
		GloomStalkerAttackSheetStateDefault()
	);

	const resetSheet = (): void => {
		dispatch({
			type: AttackSheetActionType.Reset
		});
	};

	const renderSheetContent = (): JSX.Element => {
		return (
			<>
				{state.attackStep === AttackStep.PreHitRoll && <PreHitRollState
					hasAdvantage={state.hasAdvantage}
					setHasAdvantage={(value) => dispatch({ type: AttackSheetActionType.SetAdvantage, payload: value })}
					onRollForAttack={() => dispatch({ type: AttackSheetActionType.RollForAttack })}
				/>}
				{state.attackStep === AttackStep.PostHitRoll && <div>Post Hit Roll State</div>}
				{state.attackStep === AttackStep.PreDamageRoll && <div>Pre Damage Roll State</div>}
				{state.attackStep === AttackStep.PostDamageRoll && <div>Post Damage Roll State</div>}
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