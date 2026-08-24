import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AttackSheetStep, GoBackButton } from "@/attackSheet/Steps/AttackSheetSteps";
import { PaladinAttackSheetState, CritStatus } from "../../PaladinTypes";
import { GetCritStatus, GetHighestAttackValue, GetHitPreConfirmStatusColorClass } from "../AttackSheetStateFunctions";
import {
	IPalAttackSheetCommand,
	ConfirmIsMissCommand,
	ConfirmIsHitCommand
} from "../Commands/AttackSheetCommands";

interface PostAttackRollStepProps {
	state: PaladinAttackSheetState;
	dispatch: React.Dispatch<IPalAttackSheetCommand>;
}

export default function PostAttackRollStep({ state, dispatch }: PostAttackRollStepProps) {
	const characterState = state.characterState;
	const confirmIsHit = () => dispatch(new ConfirmIsHitCommand());
	const confirmIsMiss = () => dispatch(new ConfirmIsMissCommand());

	const critStatus = GetCritStatus(characterState);
	const isCritical = critStatus === CritStatus.CriticalHit;
	const hitValueTextColorClass = GetHitPreConfirmStatusColorClass(characterState);
	const highestAttackValue = GetHighestAttackValue(characterState);

	return (
		<AttackSheetStep
			title="Post Attack Roll"
			description="Did Attack Hit?"
			actions={<>
				<Button onClick={confirmIsHit} disabled={critStatus === CritStatus.CriticalMiss}>Hit</Button>
				<Button variant="secondary" onClick={confirmIsMiss} disabled={isCritical}>Missed</Button>
				<GoBackButton dispatch={dispatch} />
			</>}
		>
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
		</AttackSheetStep>
	);
}
