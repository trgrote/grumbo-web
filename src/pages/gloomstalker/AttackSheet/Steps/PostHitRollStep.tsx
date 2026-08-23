import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { GloomStalkerAttackSheetState, CritStatus } from "../../GloomStalkerTypes";
import { GetCritStatus, GetFavoredEnemyBonus, GetHighestHitValue, GetHitPreConfirmStatusColorClass } from "../AttackSheetStateFunctions";
import { FormatSignedModifier } from "@/utils/Formatting";
import {
	IGSAttackSheetCommand,
	GoBackCommand,
	ConfirmIsMissCommand,
	ConfirmIsHitCommand
} from "../Commands/AttackSheetCommands";

interface PostHitRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<IGSAttackSheetCommand>;
}

export default function PostHitRollStep({ state, dispatch }: PostHitRollStepProps) {
	const character = state.character;
	const attackRolls = character.attackRolls;
	const attackModifier = character.gloomStalkerInfo.attackModifier;
	const confirmIsHit = () => dispatch(new ConfirmIsHitCommand());
	const confirmIsMiss = () => dispatch(new ConfirmIsMissCommand());
	const goBack = () => dispatch(new GoBackCommand());

	const hitStatus = GetCritStatus(character);
	const hitValueTextColorClass = GetHitPreConfirmStatusColorClass(character);
	const highestHitValue = GetHighestHitValue(character);

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
				<Label>Attack Modifier: {FormatSignedModifier(attackModifier)}</Label>
				{character.applySharpShooterPenalty && <Label>Sharp Shooter Penalty: -5</Label>}
				{character.selectedFavoredEnemies.length > 0 && (
					<Label>Favored Enemy Bonus: +{GetFavoredEnemyBonus(character)} ({character.selectedFavoredEnemies.join(', ')})</Label>
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
			</div>
			<SheetFooter>
				<Button onClick={confirmIsHit} disabled={hitStatus === CritStatus.CriticalMiss}>Hit</Button>
				<Button variant="secondary" onClick={confirmIsMiss} disabled={hitStatus === CritStatus.CriticalHit}>Missed</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}