import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { JSX, useState } from "react";

interface PostDamageRollStateProps {
	piercingDamageRolls: number[];
	rerollPiercingDamageDie: () => void;
	confirmDamage: () => void;
	goBack: () => void;
}

export default function PostDamageRollState({ piercingDamageRolls, rerollPiercingDamageDie, confirmDamage, goBack }: PostDamageRollStateProps): JSX.Element {
	// Only allow reroll once
	const [rereollUsed, setRerollUsed] = useState(false);
	const handleReroll = (): void => {
		rerollPiercingDamageDie();
		setRerollUsed(true);
	};

	return (
		<>
			<SheetHeader>
				<SheetTitle>Post Hit Roll</SheetTitle>
				<SheetDescription>
					Apply any additional damage modifiers and confirm final damage rolls
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<Label>Piercing Damage Rolls: [{piercingDamageRolls.join(', ')}]</Label>
				<Button onClick={handleReroll} disabled={rereollUsed}>Reroll Lowest Piercing Damage Roll?</Button>
			</div>
			<SheetFooter>
				<Button onClick={confirmDamage}>Confirm Damage</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}