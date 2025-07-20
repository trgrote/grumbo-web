import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AttackRollResult } from "../PaladinTypes";

interface IsHitStateProps {
	attackRollResult: AttackRollResult,
	onAttackHit: () => void;
	onAttackMiss: () => void;
	onIsHitBack: () => void;
};

export default function IsHitState(props: IsHitStateProps) {
	const {
		attackRollResult,
		onAttackHit,
		onAttackMiss,
		onIsHitBack
	} = props;

	const toHitvalue = Math.max(...attackRollResult.toHitValues);
	const { isCritical } = attackRollResult;

	const hitValueTextColorClass = isCritical ? 'text-blue-500' : 'text-green-500';

	return (
		<>
			<SheetHeader>
				<SheetTitle>Roll for Attack</SheetTitle>
				<SheetDescription>
					Did Attack Hit?
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<Label>Critical Hit: <Checkbox disabled checked={isCritical} /></Label>
				<Card>
					<h2 className={`text-center ${hitValueTextColorClass}`}>
						{isCritical && <strong>{toHitvalue}</strong>}
						{!isCritical && toHitvalue}
					</h2>
				</Card>
			</div>
			<SheetFooter>
				<Button onClick={onAttackHit}>Hit</Button>
				<Button variant="secondary" onClick={onAttackMiss}>Missed</Button>
				<Button variant="outline" onClick={onIsHitBack}>Back</Button>
			</SheetFooter>
		</>
	);
};