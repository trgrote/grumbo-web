import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PostHitRollStateProps {
	attackRolls: number[];
	attackModifier: number;
	confirmIsHit: () => void;
	confirmIsMiss: () => void;
	goBack: () => void;
}

export default function PostHitRollState({ attackRolls, attackModifier, confirmIsHit, confirmIsMiss, goBack }: PostHitRollStateProps) {
	const highestRoll = Math.max(...attackRolls);
	const isCritical = highestRoll >= 20;
	const hitValueTextColorClass = isCritical ? 'text-blue-500' : 'text-green-500';
	const totalToHitValue = highestRoll + attackModifier;

	return (
		<>
			<SheetHeader>
				<SheetTitle>Post Hit Roll</SheetTitle>
				<SheetDescription>
					Did Attack Hit?
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<Label>To Hit Rolls: [{attackRolls.join(', ')}]</Label>
				<Label>Attack Modifier: {attackModifier >= 0 ? `+${attackModifier}` : attackModifier}</Label>
				<Label>Critical Hit: <Checkbox disabled checked={isCritical} /></Label>
				<Card>
					<h2 className={`text-center ${hitValueTextColorClass}`}>
						{isCritical && <strong>{totalToHitValue}</strong>}
						{!isCritical && totalToHitValue}
					</h2>
				</Card>
			</div>
			<SheetFooter>
				<Button onClick={confirmIsHit}>Hit</Button>
				<Button variant="secondary" onClick={confirmIsMiss}>Missed</Button>
				<Button variant="outline" onClick={goBack}>Back</Button>
			</SheetFooter>
		</>
	);
}