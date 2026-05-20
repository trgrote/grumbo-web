import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AttackSheetActionType, GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { AttackSheetAction } from "../AttackSheetStateReducer";

interface PreDamageRollStepProps {
	state: GloomStalkerAttackSheetState;
	dispatch: React.Dispatch<AttackSheetAction>;
}

export default function PreDamageRollStep({ state, dispatch }: PreDamageRollStepProps) {
	const isDreadAmbusherExtraAttack = state.isDreadAmbusherExtraAttack;
	const setIsDreadAmbusherExtraAttack = (value: boolean) => dispatch({ type: AttackSheetActionType.SetIsDreadAmbusherExtraAttack, payload: value });
	const applyHuntersMark = state.applyHuntersMark;
	const setApplyHuntersMark = (value: boolean) => dispatch({ type: AttackSheetActionType.SetApplyHuntersMark, payload: value });
	const rollForDamage = () => dispatch({ type: AttackSheetActionType.RollForDamage });
	const goBack = () => dispatch({ type: AttackSheetActionType.GoBack });

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
					<Label htmlFor="applyHuntersMark" className="flex items-center space-x-2">
						<Checkbox id="applyHuntersMark" className="flex items-center space-x-2" checked={applyHuntersMark}
							onCheckedChange={() => setApplyHuntersMark(!applyHuntersMark)} />
						Apply Hunter's Mark damage? (adds 1d6 damage on hit)
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