import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JSX, useReducer } from "react";
import { AttackSheetActionType, AttackStep, GloomStalkerInfo } from "./GloomStalkerTypes";
import { GloomStalkerAttackSheetStateDefault, GloomStalkerAttackSheetStateReducer } from "./GloomStalkerAttackSheetState";
import PreHitRollState from "./AttackSheetStates/PreHitRollState";
import PostHitRollState from "./AttackSheetStates/PostHitRollState";
import PreDamageRollState from "./AttackSheetStates/PreDamageRollState";
import PostDamageRollState from "./AttackSheetStates/PostDamageRollState";

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
				{state.attackStep === AttackStep.PreHitRoll && <PreHitRollState
					hasAdvantage={state.hasAdvantage}
					setHasAdvantage={(value) => dispatch({ type: AttackSheetActionType.SetAdvantage, payload: value })}
					applySharpShooterPenalty={state.applySharpShooterPenalty}
					setApplySharpShooterPenalty={(value) => dispatch({ type: AttackSheetActionType.SetApplySharpShooterPenalty, payload: value })}
					onRollForAttack={() => dispatch({ type: AttackSheetActionType.RollForAttack, payload: gloomStalkerInfo })}
				/>}
				{state.attackStep === AttackStep.PostHitRoll && <PostHitRollState
					attackRolls={state.attackRolls}
					attackModifier={gloomStalkerInfo.attackModifier + (state.applySharpShooterPenalty ? -5 : 0)}
					confirmIsHit={() => dispatch({ type: AttackSheetActionType.ConfirmIsHit })}
					confirmIsMiss={() => dispatch({ type: AttackSheetActionType.ConfirmIsMiss })}
					goBack={() => dispatch({ type: AttackSheetActionType.GoBack })}
				/>}
				{state.attackStep === AttackStep.PreDamageRoll && <PreDamageRollState
					isDreadAmbusherExtraAttack={state.isDreadAmbusherExtraAttack}
					setIsDreadAmbusherExtraAttack={(value) => dispatch({ type: AttackSheetActionType.SetIsDreadAmbusherExtraAttack, payload: value })}
					applyHuntersMark={state.applyHuntersMark}
					setApplyHuntersMark={(value) => dispatch({ type: AttackSheetActionType.SetApplyHuntersMark, payload: value })}
					rollForDamage={() => dispatch({ type: AttackSheetActionType.RollForDamage, payload: gloomStalkerInfo })}
					goBack={() => dispatch({ type: AttackSheetActionType.GoBack })}
				/>}
				{state.attackStep === AttackStep.PostDamageRoll && <PostDamageRollState
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