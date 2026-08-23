import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { JSX } from "react";
import { GloomStalkerAttackSheetState } from '../../GloomStalkerTypes';
import { FormatDieRolls, GetIsAlreadyBestRolls, GetRerollButtonText } from "../AttackSheetStateFunctions";
import {
	IGSAttackSheetCommand,
	GoBackCommand,
	ConfirmDamageCommand,
	RerollWorstDamageDieCommand
} from "../Commands/AttackSheetCommands";

interface PostDamageRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<IGSAttackSheetCommand>;
}

export default function PostDamageRollStep({ state, dispatch }: PostDamageRollStepProps): JSX.Element {
	const character = state.character;
	const rerollDamageDie = () => dispatch(new RerollWorstDamageDieCommand());
	const confirmDamage = () => dispatch(new ConfirmDamageCommand());
	const goBack = () => dispatch(new GoBackCommand());

	const handleReroll = (): void => {
		rerollDamageDie();
	};

	const alreadyBestRolls = GetIsAlreadyBestRolls(character);
	const rerollButtonText = GetRerollButtonText(character);

	return (
		<>
			<SheetHeader>
				<SheetTitle>Post Damage Roll</SheetTitle>
				<SheetDescription>
					Apply any additional damage modifiers and confirm final damage rolls
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<Label>Piercing Damage Rolls: [{FormatDieRolls(character.piercingDamageRolls, character.piercingDamageDicePool)}]</Label>
				<Label>Fire Damage Rolls: [{FormatDieRolls(character.fireDamageRolls, character.fireDamageDicePool)}]</Label>
				{character.forceDamageRolls.length > 0 && (
					<Label>Force Damage Rolls: [{FormatDieRolls(character.forceDamageRolls, character.forceDamageDicePool)}]</Label>
				)}
				<Button onClick={handleReroll} disabled={character.hasUsedReroll || alreadyBestRolls}>
					{rerollButtonText}
				</Button>
			</div>
			<SheetFooter>
				<Button onClick={confirmDamage}>Confirm Damage</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}