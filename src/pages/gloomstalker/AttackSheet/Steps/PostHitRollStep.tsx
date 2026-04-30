import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AttackSheetAction } from "../AttackSheetStateReducer";
import { AttackSheetActionType, GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";

interface PostHitRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<AttackSheetAction>;
}

export default function PostHitRollStep({ state, dispatch }: PostHitRollStepProps) {
	const attackRolls = state.attackRolls;
	const attackModifier = state.gloomStalkerInfo.attackModifier;
	const confirmIsHit = () => dispatch({ type: AttackSheetActionType.ConfirmIsHit });
	const confirmIsMiss = () => dispatch({ type: AttackSheetActionType.ConfirmIsMiss });
	const goBack = () => dispatch({ type: AttackSheetActionType.GoBack });

	const highestRoll = Math.max(...attackRolls);
	const isCritical = highestRoll >= 20;
	const hitValueTextColorClass = isCritical ? 'text-blue-500' : 'text-green-500';
	const totalToHitValue = highestRoll + attackModifier - (state.applySharpShooterPenalty ? 5 : 0);

	return (
		<>
			<SheetHeader>
				<SheetTitle>Post Hit Roll</SheetTitle>
				<SheetDescription>
					Did Attack Hit?
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<Label>To Hit Rolls: [{attackRolls.join(', ')}]</Label>
				<Label>Attack Modifier: {attackModifier >= 0 ? `+${attackModifier}` : attackModifier}</Label>
				{state.applySharpShooterPenalty && <Label>Sharp Shooter Penalty: -5</Label>}
				<Label>Critical Hit: <Checkbox disabled checked={isCritical} /></Label>
				<Card>
					<h2 className={`text-center ${hitValueTextColorClass}`}>
						{isCritical && <strong>{totalToHitValue}</strong>}
						{!isCritical && totalToHitValue}
					</h2>
				</Card>
			</div>
			<SheetFooter>
				<Button onClick={confirmIsHit}>Hit</Button>
				<Button variant="secondary" onClick={confirmIsMiss}>Missed</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}