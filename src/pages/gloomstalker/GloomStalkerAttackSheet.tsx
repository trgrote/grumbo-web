import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JSX, useReducer } from "react";
import { AttackSheetActionType, AttackStep, GloomStalkerInfo } from "./GloomStalkerTypes";
import { AttackSheetStateReducer } from "./AttackSheet/AttackSheetStateReducer.tsx";
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
		AttackSheetStateReducer,
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
					state={state}
					dispatch={dispatch}
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