import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SpellSlotToString } from "../PaladinFunctions";

interface DamageInfoStateProps {
	isTargetFiendOrUndead: boolean;
	setIsTargetFiendOrUndead: (value: boolean) => void;
	spellSlotUsed: number;
	setSpellSlotUsed: (value: number) => void;
	onRollForDamage: () => void;
	onDamageInfoBack: () => void;
};

const spellSlots = [0, 1, 2, 3, 4];

export default function DamageInfoState(props: DamageInfoStateProps) {
	const {
		isTargetFiendOrUndead,
		setIsTargetFiendOrUndead,
		spellSlotUsed,
		setSpellSlotUsed,
		onRollForDamage,
		onDamageInfoBack
	} = props;

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
					<Label htmlFor="isTargetFiendOrUndead">
						<Checkbox id="isTargetFiendOrUndead" checked={isTargetFiendOrUndead}
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
				<Button onClick={onRollForDamage}>Roll For Damage</Button>
				<Button variant="outline" onClick={onDamageInfoBack}>Back</Button>
			</SheetFooter>
		</>
	);
};