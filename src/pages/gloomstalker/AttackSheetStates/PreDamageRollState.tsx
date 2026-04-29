import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PreDamageRollStateProps {
	isDreadAmbusherExtraAttack: boolean;
	setIsDreadAmbusherExtraAttack: (value: boolean) => void;
	rollForDamage: () => void;
	goBack: () => void;
}

export default function PreDamageRollState({ isDreadAmbusherExtraAttack, setIsDreadAmbusherExtraAttack, rollForDamage, goBack }: PreDamageRollStateProps) {
	return (
		<>
			<SheetHeader>
				<SheetTitle>Pre Damgage Roll</SheetTitle>
				<SheetDescription>
					Provide Additional Damage Information before rolling for damage
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<div className="grid gap-3">
					<Label htmlFor="isDreadAmbusherExtraAttack" className="flex items-center space-x-2">
						<Checkbox id="isDreadAmbusherExtraAttack" className="flex items-center space-x-2" checked={isDreadAmbusherExtraAttack}
							onCheckedChange={() => setIsDreadAmbusherExtraAttack(!isDreadAmbusherExtraAttack)} />
						Is First Turn of Combat and Extra Attack from Dread Ambusher (gains additional damage on first attack of turn)
					</Label>
				</div>
			</div>
			<SheetFooter>
				<Button onClick={rollForDamage}>Roll for Damage</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}