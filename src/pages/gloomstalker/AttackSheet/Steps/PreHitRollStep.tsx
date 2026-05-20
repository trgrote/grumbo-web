import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "../Commands/IGSAttackSheetCommand";
import SetAdvantageCommand from "../Commands/SetAdvantageCommand";
import RollForAttackCommand from "../Commands/RollForAttackCommand";
import SetApplySharpShooterPenaltyCommand from "../Commands/SetApplySharpShooterPenaltyCommand";

interface PreHitRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<IGSAttackSheetCommand>;
}

export default function PreHitRollStep({ state, dispatch }: PreHitRollStepProps) {
	const hasAdvantage = state.hasAdvantage;
	const setHasAdvantage = (value: boolean) => dispatch(new SetAdvantageCommand(value));
	const applySharpShooterPenalty = state.applySharpShooterPenalty;
	const setApplySharpShooterPenalty = (value: boolean) => dispatch(new SetApplySharpShooterPenaltyCommand(value));
	const onRollForAttack = () => dispatch(new RollForAttackCommand());

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