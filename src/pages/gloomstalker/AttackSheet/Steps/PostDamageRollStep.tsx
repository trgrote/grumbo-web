import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { JSX, useState } from "react";
import { GloomStalkerAttackSheetState } from '../../GloomStalkerTypes';
import { GetBestRerollOption } from "../AttackSheetStateFunctions";
import IGSAttackSheetCommand from "../Commands/IGSAttackSheetCommand";
import GoBackCommand from "../Commands/GoBackCommand";
import ConfirmDamageCommand from "../Commands/ConfirmDamageCommand";
import RerollPiercingDamageDieCommand from "../Commands/RerollPiercingDamageDieCommand";

interface PostDamageRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<IGSAttackSheetCommand>;
}

export default function PostDamageRollStep({ state, dispatch }: PostDamageRollStepProps): JSX.Element {
	// Only allow reroll once
	const [rereollUsed, setRerollUsed] = useState(false);

	const rerollDamageDie = () => dispatch(new RerollPiercingDamageDieCommand());
	const confirmDamage = () => dispatch(new ConfirmDamageCommand());
	const goBack = () => dispatch(new GoBackCommand());

	const handleReroll = (): void => {
		rerollDamageDie();
		setRerollUsed(true);
	};

	const formatDieRolls = (rolls: number[], dicePool: number[]): string => {
		return rolls.map((roll, index) => `d${dicePool[index]}->${roll}`).join(', ');
	};

	const bestRerollOption = GetBestRerollOption(state);
	const alreadyBestRolls = bestRerollOption.roll === bestRerollOption.dieSize;
	let rerollButtonText = `Reroll Lowest Damage Roll? (d${bestRerollOption.dieSize}->${bestRerollOption.roll})`;

	if (rereollUsed) {
		rerollButtonText = "Reroll Used";
	} else if (alreadyBestRolls) {
		rerollButtonText = "Already best rolls!";
	}

	return (
		<>
			<SheetHeader>
				<SheetTitle>Post Hit Roll</SheetTitle>
				<SheetDescription>
					Apply any additional damage modifiers and confirm final damage rolls
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<Label>Piercing Damage Rolls: [{formatDieRolls(state.piercingDamageRolls, state.piercingDamageDicePool)}]</Label>
				<Label>Fire Damage Rolls: [{formatDieRolls(state.fireDamageRolls, state.fireDamageDicePool)}]</Label>
				<Button onClick={handleReroll} disabled={rereollUsed || alreadyBestRolls}>
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