import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PaladinAttackSheetState } from "../../PaladinTypes";
import { SpellSlotToString } from "../AttackSheetStateFunctions";
import {
	IPalAttackSheetCommand,
	GoBackCommand,
	RollForDamageCommand,
	SetIsTargetFiendOrUndeadCommand,
	SetSpellSlotUsedCommand
} from "../Commands/AttackSheetCommands";

interface PreDamageRollStepProps {
	state: PaladinAttackSheetState;
	dispatch: React.Dispatch<IPalAttackSheetCommand>;
}

const spellSlots = [0, 1, 2, 3, 4];

export default function PreDamageRollStep({ state, dispatch }: PreDamageRollStepProps) {
	const isTargetFiendOrUndead = state.isTargetFiendOrUndead;
	const setIsTargetFiendOrUndead = (value: boolean) => dispatch(new SetIsTargetFiendOrUndeadCommand(value));
	const spellSlotUsed = state.spellSlotUsed;
	const setSpellSlotUsed = (value: number) => dispatch(new SetSpellSlotUsedCommand(value));
	const rollForDamage = () => dispatch(new RollForDamageCommand());
	const goBack = () => dispatch(new GoBackCommand());

	return (
		<>
			<SheetHeader>
				<SheetTitle>Damage Info</SheetTitle>
				<SheetDescription>
					Provide Additional Damage Information
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<div className="grid gap-3" title="Adds 1d8 Radiant Damage on any attack against undead or fiends">
					<Label htmlFor="isTargetFiendOrUndead" className="flex items-center space-x-2">
						<Checkbox id="isTargetFiendOrUndead" className="flex items-center space-x-2" checked={isTargetFiendOrUndead}
							onCheckedChange={() => setIsTargetFiendOrUndead(!isTargetFiendOrUndead)} />
						Is Target Fiend or Undead?
					</Label>
				</div>
				<div className="grid gap-3">
					<Label>
						Spell Slot Used?
					</Label>
					<ToggleGroup type="single" className="w-full"
						value={spellSlotUsed.toString()}
						onValueChange={newValue => setSpellSlotUsed(parseInt(newValue))}>
						{
							spellSlots.map((spellSlot, i) =>
								<ToggleGroupItem key={i} value={spellSlot.toString()}>
									{SpellSlotToString(spellSlot)}
								</ToggleGroupItem>
							)
						}
					</ToggleGroup>
				</div>
			</div>
			<SheetFooter>
				<Button onClick={rollForDamage}>Roll For Damage</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}
