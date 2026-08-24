import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AttackSheetStep, GoBackButton } from "@/attackSheet/Steps/AttackSheetSteps";
import { GloomStalkerAttackSheetState, CritStatus } from "../../GloomStalkerTypes";
import { GetCritStatus, GetFavoredEnemyBonus, GetHighestAttackValue, GetHitPreConfirmStatusColorClass } from "../AttackSheetStateFunctions";
import { FormatSignedModifier } from "@/utils/Formatting";
import {
	IGSAttackSheetCommand,
	ConfirmIsMissCommand,
	ConfirmIsHitCommand
} from "../Commands/AttackSheetCommands";

interface PostAttackRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<IGSAttackSheetCommand>;
}

export default function PostAttackRollStep({ state, dispatch }: PostAttackRollStepProps) {
	const characterState = state.characterState;
	const attackRolls = characterState.attackRolls;
	const attackModifier = characterState.gloomStalkerInfo.attackModifier;
	const confirmIsHit = () => dispatch(new ConfirmIsHitCommand());
	const confirmIsMiss = () => dispatch(new ConfirmIsMissCommand());

	const hitStatus = GetCritStatus(characterState);
	const hitValueTextColorClass = GetHitPreConfirmStatusColorClass(characterState);
	const highestHitValue = GetHighestAttackValue(characterState);

	return (
		<AttackSheetStep
			title="Post Attack Roll"
			description="Did Attack Hit?"
			actions={<>
				<Button onClick={confirmIsHit} disabled={hitStatus === CritStatus.CriticalMiss}>Hit</Button>
				<Button variant="secondary" onClick={confirmIsMiss} disabled={hitStatus === CritStatus.CriticalHit}>Missed</Button>
				<GoBackButton dispatch={dispatch} />
			</>}
		>
			<Label>To Hit Rolls: [{attackRolls.join(', ')}]</Label>
			<Label>Attack Modifier: {FormatSignedModifier(attackModifier)}</Label>
			{characterState.applySharpShooterPenalty && <Label>Sharp Shooter Penalty: -5</Label>}
			{characterState.selectedFavoredEnemies.length > 0 && (
				<Label>Favored Enemy Bonus: +{GetFavoredEnemyBonus(characterState)} ({characterState.selectedFavoredEnemies.join(', ')})</Label>
			)}
			{hitStatus === CritStatus.CriticalHit && (
				<Label>Critical Hit</Label>
			)}
			{hitStatus === CritStatus.CriticalMiss && (
				<Label>Critical Miss</Label>
			)}
			<Card>
				<h2 className={`text-center ${hitValueTextColorClass}`}>
					{hitStatus === CritStatus.CriticalHit && <strong>{highestHitValue}</strong>}
					{hitStatus !== CritStatus.CriticalHit && highestHitValue}
				</h2>
			</Card>
		</AttackSheetStep>
	);
}
