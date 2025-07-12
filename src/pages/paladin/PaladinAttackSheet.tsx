import { Card } from "@/components/ui/card";
import { RollAttack, RollDamage, SpellSlotToString } from "./PaladinFunctions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { JSX, useState } from "react";
import { AttackRollResult, PaladinInfo, RollDamageResult, RollHistoryRecord } from "./PaladinTypes";
import RollResultView from "./RollResultView";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export interface PaladinAttackPaladinAttackSheetProps {
	paladinInfo: PaladinInfo;
	addToRollHistory: (result: RollHistoryRecord) => void;
}

enum AttackState {
	AttackInfo,
	isHit,
	DamageInfo,
	Result
}

// TODO: Add a back button
// TODO: Fix Results view to Totals and Damage Breakdown
// TODO: Update To Hit state to indicate if hit was a crit
export default function PaladinAttackSheet({ paladinInfo, addToRollHistory }: PaladinAttackPaladinAttackSheetProps) {
	const [attackState, setAttackState] = useState(AttackState.AttackInfo);

	const [hasAdvantage, setHasAdvantage] = useState(false);
	const [isTargetFiendOrUndead, setIsTargetFiendOrUndead] = useState(false);

	const [attackRollResult, setAttackRollResult] = useState<AttackRollResult | null>(null);

	const [spellSlotUsed, setSpellSlotUsed] = useState(0);

	const [damageRollResult, setDamageRollResult] = useState<RollDamageResult | null>(null);

	const getCurrentHistoryResult = (): RollHistoryRecord => {
		const rval: RollHistoryRecord = {
			...paladinInfo,
			hasAdvantage,
			isTargetFiendOrUndead,
			spellSlotUsed,
			toHitValues: [],
			isCritical: false,
			weaponDamageRolls: [],
			divineSmiteDamageRolls: []
		};

		if (attackRollResult) {
			rval.toHitValues = attackRollResult.toHitValues;
			rval.isCritical = attackRollResult.isCritical;
		}

		if (damageRollResult) {
			rval.weaponDamageRolls = damageRollResult.weaponDamageRolls;
			rval.divineSmiteDamageRolls = damageRollResult.divineSmiteDamageRolls;
		}

		return rval;
	};

	const onRollForAttack = () => {
		const attackResult = RollAttack({
			attackModifier: paladinInfo.attackModifier,
			hasAdvantage: hasAdvantage
		});

		setAttackRollResult(attackResult);
		setAttackState(AttackState.isHit);
	};

	const onAttackHit = () => {
		setAttackState(AttackState.DamageInfo);
	};

	const onAttackMiss = () => {
		if (!attackRollResult) {
			return;
		}

		addToRollHistory(getCurrentHistoryResult());
		setAttackState(AttackState.Result);
	};

	const onRollForDamage = () => {
		if (!attackRollResult) {
			return;
		}

		const damageResult = RollDamage({
			...paladinInfo,
			...attackRollResult,
			isTargetFiendOrUndead,
			spellSlotUsed
		});

		addToRollHistory(getCurrentHistoryResult());

		setDamageRollResult(damageResult);
		setAttackState(AttackState.Result);
	};

	const resetSheet = () => {
		setAttackState(AttackState.AttackInfo);
		setHasAdvantage(false);
		setIsTargetFiendOrUndead(false);
		setAttackRollResult(null);
		setSpellSlotUsed(0);
		setDamageRollResult(null);
	};

	const renderSheetContent = (): JSX.Element => {
		if (attackState === AttackState.AttackInfo) {
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
						<div className="grid gap-3" title="Adds 1d8 Radiant Damage on any attack against undead or fiends">
							<Label htmlFor="isTargetFiendOrUndead">
								<Checkbox id="isTargetFiendOrUndead" checked={isTargetFiendOrUndead}
									onCheckedChange={() => setIsTargetFiendOrUndead(!isTargetFiendOrUndead)} />
								Is Target Fiend or Undead?
							</Label>
						</div>
					</div>
					<SheetFooter>
						<Button onClick={onRollForAttack} type="submit">Roll for Attack</Button>
						<SheetClose asChild>
							<Button variant="outline">Close</Button>
						</SheetClose>
					</SheetFooter>
				</>
			);
		} else if (attackState === AttackState.isHit && attackRollResult) {
			const toHitvalue = Math.max(...attackRollResult.toHitValues);

			return (
				<>
					<SheetHeader>
						<SheetTitle>Roll for Attack</SheetTitle>
						<SheetDescription>
							Did Attack Hit?
						</SheetDescription>
					</SheetHeader>
					<Card>
						<div className="text-center">
							{toHitvalue}
						</div>
					</Card>
					<SheetFooter>
						<Button onClick={onAttackHit}>Hit</Button>
						<Button variant="secondary" onClick={onAttackMiss}>Missed</Button>
						<SheetClose asChild>
							<Button variant="outline">Close</Button>
						</SheetClose>
					</SheetFooter>
				</>
			);
		} else if (attackState === AttackState.DamageInfo) {
			return (
				<>
					<SheetHeader>
						<SheetTitle>Damage Info</SheetTitle>
						<SheetDescription>
							Provide Additional Damage Information
						</SheetDescription>
					</SheetHeader>
					<div className="grid flex-1 auto-rows-min gap-6 px-4">
						<Label>
							Spell Slot Used?
						</Label>
						<ToggleGroup type="single"
							value={spellSlotUsed.toString()}
							onValueChange={newValue => setSpellSlotUsed(parseInt(newValue))}>
							{
								[0, 1, 2, 3, 4].map((spellSlot, i) =>
									<ToggleGroupItem key={i} value={spellSlot.toString()}>
										<div className="w-12">{SpellSlotToString(spellSlot)}</div>
									</ToggleGroupItem>
								)
							}
						</ToggleGroup>
					</div>
					<SheetFooter>
						<Button onClick={onRollForDamage}>Roll For Damage</Button>
						<SheetClose asChild>
							<Button variant="outline">Close</Button>
						</SheetClose>
					</SheetFooter>
				</>
			);
		} else if (attackState === AttackState.Result && attackRollResult) {
			return (
				<>
					<SheetHeader>
						<SheetTitle>Results</SheetTitle>
						<SheetDescription>
							Attack and Damage Results
						</SheetDescription>
					</SheetHeader>
					<RollResultView
						{...getCurrentHistoryResult()}
						defaultOpen
					/>
					<SheetFooter>
						<Button onClick={resetSheet}>Attack Again</Button>
						<SheetClose asChild>
							<Button variant="outline">Close</Button>
						</SheetClose>
					</SheetFooter>
				</>
			);
		}

		return (<></>);
	};

	return (
		<Sheet onOpenChange={(open) => { if (!open) resetSheet(); }}>
			<SheetTrigger asChild>
				<Button>Roll for Attack</Button>
			</SheetTrigger>
			<SheetContent className="dark bg-background text-neutral-300">
				{renderSheetContent()}
			</SheetContent>
		</Sheet>
	);
}