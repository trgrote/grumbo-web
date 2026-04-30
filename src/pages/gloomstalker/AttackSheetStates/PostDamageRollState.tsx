import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { JSX, useState } from "react";

interface PostDamageRollStateProps {
	pierceingDamageDicePool: number[];
	piercingDamageRolls: number[];
	fireDamageDicePool: number[];
	fireDamageRolls: number[];
	rerollDamageDie: () => void;
	confirmDamage: () => void;
	goBack: () => void;
}

// Determine which die has the greatest difference between the sides of the die and the rolled value. 
// For example, if there are two damage rolls of 4, but one is from a d8 and the other is from a d6, 
// then the d8 would be the best die to reroll because it has the potential to increase the damage by 4, 
// while the d6 can only increase the damage by 2. 
// If there are multiple dice with the same difference, prioritize rerolling the highest sided die.
const getBestRerollOption = (piercingDamageDicePool: number[], piercingDamageRolls: number[], fireDamageDicePool: number[], fireDamageRolls: number[]): { die: number; currentValue: number; } => {
	const allRolls = [
		...piercingDamageRolls.map((roll, i) => ({ roll, dieSize: piercingDamageDicePool[i], type: 'piercing', index: i })),
		...fireDamageRolls.map((roll, i) => ({ roll, dieSize: fireDamageDicePool[i], type: 'fire', index: i }))
	];

	return allRolls.reduce((best, current) => {
		const currentDifference = current.dieSize - current.roll;
		const bestDifference = best.die - best.currentValue;

		if (currentDifference > bestDifference || (currentDifference === bestDifference && current.dieSize > best.die)) {
			return {
				die: current.dieSize,
				currentValue: current.roll,
				type: current.type,
				index: current.index
			};
		}
		return best;
	}, { die: 0, currentValue: 0, type: '', index: -1 });
};

export default function PostDamageRollState({ pierceingDamageDicePool, piercingDamageRolls, fireDamageDicePool, fireDamageRolls, rerollDamageDie, confirmDamage, goBack }: PostDamageRollStateProps): JSX.Element {
	// Only allow reroll once
	const [rereollUsed, setRerollUsed] = useState(false);
	const handleReroll = (): void => {
		rerollDamageDie();
		setRerollUsed(true);
	};

	const bestRerollOption = getBestRerollOption(pierceingDamageDicePool, piercingDamageRolls, fireDamageDicePool, fireDamageRolls);

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
				<Label>Fire Damage Rolls: [{fireDamageRolls.join(', ')}]</Label>
				<Button onClick={handleReroll} disabled={rereollUsed}>
					Reroll Lowest Damage Roll?
					(d{bestRerollOption.die} that rolled a {bestRerollOption.currentValue})
				</Button>
			</div>
			<SheetFooter>
				<Button onClick={confirmDamage}>Confirm Damage</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}