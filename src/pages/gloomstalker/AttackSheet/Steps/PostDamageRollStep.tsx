import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { JSX } from "react";
import { AttackSheetStep, GoBackButton } from "@/attackSheet/Steps/AttackSheetSteps";
import { GloomStalkerAttackSheetState } from '../../GloomStalkerTypes';
import { FormatDieRolls, GetIsAlreadyBestRolls, GetRerollButtonText } from "../AttackSheetStateFunctions";
import {
	IGSAttackSheetCommand,
	ConfirmDamageCommand,
	RerollWorstDamageDieCommand
} from "../Commands/AttackSheetCommands";

interface PostDamageRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<IGSAttackSheetCommand>;
}

export default function PostDamageRollStep({ state, dispatch }: PostDamageRollStepProps): JSX.Element {
	const characterState = state.characterState;
	const rerollDamageDie = () => dispatch(new RerollWorstDamageDieCommand());
	const confirmDamage = () => dispatch(new ConfirmDamageCommand());

	const alreadyBestRolls = GetIsAlreadyBestRolls(characterState);
	const rerollButtonText = GetRerollButtonText(characterState);

	return (
		<AttackSheetStep
			title="Post Damage Roll"
			description="Apply any additional damage modifiers and confirm final damage rolls"
			actions={<>
				<Button onClick={confirmDamage}>Confirm Damage</Button>
				<GoBackButton dispatch={dispatch} />
			</>}
		>
			<Label>Piercing Damage Rolls: [{FormatDieRolls(characterState.piercingDamageRolls, characterState.piercingDamageDicePool)}]</Label>
			<Label>Fire Damage Rolls: [{FormatDieRolls(characterState.fireDamageRolls, characterState.fireDamageDicePool)}]</Label>
			{characterState.forceDamageRolls.length > 0 && (
				<Label>Force Damage Rolls: [{FormatDieRolls(characterState.forceDamageRolls, characterState.forceDamageDicePool)}]</Label>
			)}
			<Button onClick={rerollDamageDie} disabled={characterState.hasUsedReroll || alreadyBestRolls}>
				{rerollButtonText}
			</Button>
		</AttackSheetStep>
	);
}
