import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { JSX, useState } from "react";
import { AttackSheetActionType } from "../../GloomStalkerTypes";
import { AttackSheetAction } from "../../GloomStalkerAttackSheetStateReducer";
import { GloomStalkerAttackSheetState } from '../../GloomStalkerTypes';
import { GetBestRerollOption } from "../AttackSheetStateFunctions";

interface PostDamageRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<AttackSheetAction>;
}

export default function PostDamageRollStep({ state, dispatch }: PostDamageRollStepProps): JSX.Element {
	// Only allow reroll once
	const [rereollUsed, setRerollUsed] = useState(false);

	const rerollDamageDie = () => dispatch({ type: AttackSheetActionType.RerollPiercingDamageDie });
	const confirmDamage = () => dispatch({ type: AttackSheetActionType.ConfirmDamage });
	const goBack = () => dispatch({ type: AttackSheetActionType.GoBack });

	const handleReroll = (): void => {
		rerollDamageDie();
		setRerollUsed(true);
	};

	const bestRerollOption = GetBestRerollOption(state);

	return (
		<>
			<SheetHeader>
				<SheetTitle>Post Hit Roll</SheetTitle>
				<SheetDescription>
					Apply any additional damage modifiers and confirm final damage rolls
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<Label>Piercing Damage Rolls: [{state.piercingDamageRolls.join(', ')}]</Label>
				<Label>Fire Damage Rolls: [{state.fireDamageRolls.join(', ')}]</Label>
				{!rereollUsed &&
					<Button onClick={handleReroll} disabled={rereollUsed}>
						Reroll Lowest Damage Roll?
						(d{bestRerollOption.die} that rolled a {bestRerollOption.currentValue})
					</Button>
				}
			</div>
			<SheetFooter>
				<Button onClick={confirmDamage}>Confirm Damage</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}