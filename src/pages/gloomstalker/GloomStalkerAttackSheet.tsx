import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JSX, useReducer } from "react";
import { AttackSheetActionType, AttackStep, GloomStalkerInfo } from "./GloomStalkerTypes";
import { GloomStalkerAttackSheetStateReducer } from "./GloomStalkerAttackSheetStateReducer.tsx";
import PreHitRollStep from "./AttackSheet/Steps/PreHitRollStep.tsx";
import PostHitRollStep from "./AttackSheet/Steps/PostHitRollStep";
import PreDamageRollStep from "./AttackSheet/Steps/PreDamageRollStep";
import PostDamageRollStep from "./AttackSheet/Steps/PostDamageRollStep";
import { GloomStalkerAttackSheetStateDefault } from "./AttackSheet/AttackSheetStateFunctions";

export interface GloomStalkerAttackSheetProps {
	gloomStalkerInfo: GloomStalkerInfo;
}

export default function GloomStalkerAttackSheet({ gloomStalkerInfo }: GloomStalkerAttackSheetProps) {
	const [state, dispatch] = useReducer(
		GloomStalkerAttackSheetStateReducer,
		GloomStalkerAttackSheetStateDefault(gloomStalkerInfo)
	);

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
					isDreadAmbusherExtraAttack={state.isDreadAmbusherExtraAttack}
					setIsDreadAmbusherExtraAttack={(value) => dispatch({ type: AttackSheetActionType.SetIsDreadAmbusherExtraAttack, payload: value })}
					applyHuntersMark={state.applyHuntersMark}
					setApplyHuntersMark={(value) => dispatch({ type: AttackSheetActionType.SetApplyHuntersMark, payload: value })}
					rollForDamage={() => dispatch({ type: AttackSheetActionType.RollForDamage, payload: gloomStalkerInfo })}
					goBack={() => dispatch({ type: AttackSheetActionType.GoBack })}
				/>}
				{state.attackStep === AttackStep.PostDamageRoll && <PostDamageRollStep
					state={state}
					dispatch={dispatch}
				/>}
				{state.attackStep === AttackStep.Results && <div>Results State</div>}
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