import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PreHitRollStepProps {
	hasAdvantage: boolean;
	setHasAdvantage: (value: boolean) => void;
	applySharpShooterPenalty: boolean;
	setApplySharpShooterPenalty: (value: boolean) => void;
	onRollForAttack: () => void;
}

export default function PreHitRollStep({ hasAdvantage, setHasAdvantage, applySharpShooterPenalty, setApplySharpShooterPenalty, onRollForAttack }: PreHitRollStepProps) {
	return (
		<>
			<SheetHeader>
				<SheetTitle>Roll for Attack</SheetTitle>
				<SheetDescription>
					Provide Attack Information, roll for attack, provide damage information, and then roll for damage.
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<div className="grid gap-3">
					<Label htmlFor="hasAdvantage">
						<Checkbox id="hasAdvantage" checked={hasAdvantage}
							onCheckedChange={() => setHasAdvantage(!hasAdvantage)} />
						Has Advantage?
					</Label>
				</div>
				<div className="grid gap-3">
					<Label htmlFor="applySharpShooterPenalty">
						<Checkbox id="applySharpShooterPenalty" checked={applySharpShooterPenalty}
							onCheckedChange={() => setApplySharpShooterPenalty(!applySharpShooterPenalty)} />
						Apply Sharp Shooter Penalty? (-5 to hit for +10 damage)
					</Label>
				</div>
			</div>
			<SheetFooter>
				<Button onClick={onRollForAttack} type="submit">Roll for Attack</Button>
			</SheetFooter>
		</>
	);
};