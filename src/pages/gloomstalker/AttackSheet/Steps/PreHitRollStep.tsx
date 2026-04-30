import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AttackSheetActionType, GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { AttackSheetAction } from "../AttackSheetStateReducer";

interface PreHitRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<AttackSheetAction>;
}

export default function PreHitRollStep({ state, dispatch }: PreHitRollStepProps) {
	const hasAdvantage = state.hasAdvantage;
	const setHasAdvantage = (value: boolean) => dispatch({ type: AttackSheetActionType.SetAdvantage, payload: value });
	const applySharpShooterPenalty = state.applySharpShooterPenalty;
	const setApplySharpShooterPenalty = (value: boolean) => dispatch({ type: AttackSheetActionType.SetApplySharpShooterPenalty, payload: value });
	const onRollForAttack = () => dispatch({ type: AttackSheetActionType.RollForAttack });

	return (
		<>
			<SheetHeader>
				<SheetTitle>Roll for Attack</SheetTitle>
				<SheetDescription>
					Provide pre-hit-roll information and roll for attack
				</SheetDescription>
			</SheetHeader>
			<div className="grid flex-1 auto-rows-min gap-6 px-4">
				<div className="grid gap-3">
					<Label htmlFor="hasAdvantage">
						<Checkbox id="hasAdvantage" checked={hasAdvantage}
							onCheckedChange={() => setHasAdvantage(!hasAdvantage)} />
						Has Advantage? (Roll 3d20 due to Elven Accuracy)
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