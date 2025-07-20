import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface AttackInfoStateProps {
	hasAdvantage: boolean;
	setHasAdvantage: (value: boolean) => void;
	onRollForAttack: () => void;
};

export default function AttackInfoState(props: AttackInfoStateProps) {
	const {
		hasAdvantage,
		setHasAdvantage,
		onRollForAttack
	} = props;

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
			</div>
			<SheetFooter>
				<Button onClick={onRollForAttack} type="submit">Roll for Attack</Button>
			</SheetFooter>
		</>
	);
};