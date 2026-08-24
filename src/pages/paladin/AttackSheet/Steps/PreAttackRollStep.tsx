import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AttackSheetStep } from "@/attackSheet/Steps/AttackSheetSteps";
import { PaladinAttackSheetState } from "../../PaladinTypes";
import {
	IPalAttackSheetCommand,
	SetAdvantageCommand,
	RollForAttackCommand
} from "../Commands/AttackSheetCommands";

interface PreAttackRollStepProps {
	state: PaladinAttackSheetState;
	dispatch: React.Dispatch<IPalAttackSheetCommand>;
}

export default function PreAttackRollStep({ state, dispatch }: PreAttackRollStepProps) {
	const characterState = state.characterState;
	const hasAdvantage = characterState.hasAdvantage;
	const setHasAdvantage = (value: boolean) => dispatch(new SetAdvantageCommand(value));
	const onRollForAttack = () => dispatch(new RollForAttackCommand());

	return (
		<AttackSheetStep
			title="Roll for Attack"
			description="Provide pre-attack-roll information and roll for attack"
			actions={<Button onClick={onRollForAttack} type="submit">Roll for Attack</Button>}
		>
			<div className="grid gap-3">
				<Label htmlFor="hasAdvantage" className="flex items-center space-x-2">
					<Checkbox id="hasAdvantage" className="flex items-center space-x-2" checked={hasAdvantage}
						onCheckedChange={() => setHasAdvantage(!hasAdvantage)} />
					Has Advantage?
				</Label>
			</div>
		</AttackSheetStep>
	);
};
