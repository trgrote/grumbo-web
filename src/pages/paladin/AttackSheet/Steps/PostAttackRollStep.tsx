import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { PaladinAttackSheetState, CritStatus } from "../../PaladinTypes";
import { GetCritStatus, GetHighestAttackValue, GetHitPreConfirmStatusColorClass } from "../AttackSheetStateFunctions";
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

	const critStatus = GetCritStatus(state);
	const isCritical = critStatus === CritStatus.CriticalHit;
	const hitValueTextColorClass = GetHitPreConfirmStatusColorClass(state);
	const highestAttackValue = GetHighestAttackValue(state);

	return (
		<>
			<SheetHeader>
				<SheetTitle>Post Attack Roll</SheetTitle>
				<SheetDescription>
					Did Attack Hit?
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				{isCritical && (
					<Label>Critical Hit</Label>
				)}
				{critStatus === CritStatus.CriticalMiss && (
					<Label>Critical Miss</Label>
				)}
				<Card>
					<h2 className={`text-center ${hitValueTextColorClass}`}>
						{isCritical && <strong>{highestAttackValue}</strong>}
						{!isCritical && highestAttackValue}
					</h2>
				</Card>
			</div>
			<SheetFooter>
				<Button onClick={confirmIsHit} disabled={critStatus === CritStatus.CriticalMiss}>Hit</Button>
				<Button variant="secondary" onClick={confirmIsMiss} disabled={isCritical}>Missed</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}
