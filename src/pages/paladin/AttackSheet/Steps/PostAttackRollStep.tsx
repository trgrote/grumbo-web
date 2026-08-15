import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { PaladinAttackSheetState } from "../../PaladinTypes";
import { GetHighestAttackValue, GetHitPreConfirmStatusColorClass, GetIsCritical } from "../AttackSheetStateFunctions";
import {
	IPalAttackSheetCommand,
	GoBackCommand,
	ConfirmIsMissCommand,
	ConfirmIsHitCommand
} from "../Commands/AttackSheetCommands";

interface PostAttackRollStepProps {
	state: PaladinAttackSheetState;
	dispatch: React.Dispatch<IPalAttackSheetCommand>;
}

export default function PostAttackRollStep({ state, dispatch }: PostAttackRollStepProps) {
	const confirmIsHit = () => dispatch(new ConfirmIsHitCommand());
	const confirmIsMiss = () => dispatch(new ConfirmIsMissCommand());
	const goBack = () => dispatch(new GoBackCommand());

	const isCritical = GetIsCritical(state);
	const hitValueTextColorClass = GetHitPreConfirmStatusColorClass(state);
	const highestAttackValue = GetHighestAttackValue(state);

	return (
		<>
			<SheetHeader>
				<SheetTitle>Roll for Attack</SheetTitle>
				<SheetDescription>
					Did Attack Hit?
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<Label>Critical Hit: <Checkbox disabled checked={isCritical} /></Label>
				<Card>
					<h2 className={`text-center ${hitValueTextColorClass}`}>
						{isCritical && <strong>{highestAttackValue}</strong>}
						{!isCritical && highestAttackValue}
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
