import { Card } from "@/components/ui/card";
import { RollAttack, RollDamage } from "./PaladinFunctions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { JSX, useState } from "react";
import { AttackRollResult, PaladinInfo, RollDamageResult, RollHistoryRecord } from "./PaladinTypes";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { usePaladinSound } from "./hooks/usePaladinSound";
import ResultState from "./AttackStates/ResultState";
import DamageInfoState from "./AttackStates/DamageInfoState";

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

export default function PaladinAttackSheet({ paladinInfo, addToRollHistory }: PaladinAttackPaladinAttackSheetProps) {
	const [attackState, setAttackState] = useState(AttackState.AttackInfo);

	const [hasAdvantage, setHasAdvantage] = useState(false);
	const [isTargetFiendOrUndead, setIsTargetFiendOrUndead] = useState(false);

	const [attackRollResult, setAttackRollResult] = useState<AttackRollResult | null>(null);

	const [isHit, setIsHit] = useState(false);

	const [spellSlotUsed, setSpellSlotUsed] = useState(0);

	const [damageRollResult, setDamageRollResult] = useState<RollDamageResult | null>(null);

	const playRandomPaladinSound = usePaladinSound();

	const getCurrentHistoryResult = (): RollHistoryRecord => {
		const rval: RollHistoryRecord = {
			...paladinInfo,
			hasAdvantage,
			isHit,
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

		if (attackResult.isCritical) {
			playRandomPaladinSound();
		}

		setAttackRollResult(attackResult);
		setAttackState(AttackState.isHit);
	};

	const onIsHitBack = () => {
		setAttackState(AttackState.AttackInfo);
		setAttackRollResult(null);
	};

	const onAttackHit = () => {
		setIsHit(true);
		setAttackState(AttackState.DamageInfo);
	};

	const onAttackMiss = () => {
		if (!attackRollResult) {
			return;
		}

		addToRollHistory(getCurrentHistoryResult());
		setAttackState(AttackState.Result);
	};

	const onDamageInfoBack = () => {
		setIsHit(false);
		setAttackState(AttackState.isHit);
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

		setDamageRollResult(damageResult);

		addToRollHistory({ ...getCurrentHistoryResult(), ...damageResult });
		setAttackState(AttackState.Result);
	};

	const onAttackAgain = () => {
		setAttackState(AttackState.AttackInfo);
		setAttackRollResult(null);
		setIsHit(false);
		setDamageRollResult(null);
		setSpellSlotUsed(0);
	};

	const resetSheet = () => {
		setAttackState(AttackState.AttackInfo);
		setHasAdvantage(false);
		setIsHit(false);
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
					</div>
					<SheetFooter>
						<Button onClick={onRollForAttack} type="submit">Roll for Attack</Button>
					</SheetFooter>
				</>
			);
		} else if (attackState === AttackState.isHit && attackRollResult) {
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
		} else if (attackState === AttackState.DamageInfo) {
			return (
				<DamageInfoState
					isTargetFiendOrUndead={isTargetFiendOrUndead}
					setIsTargetFiendOrUndead={setIsTargetFiendOrUndead}
					spellSlotUsed={spellSlotUsed}
					setSpellSlotUsed={setSpellSlotUsed}
					onRollForDamage={onRollForDamage}
					onDamageInfoBack={onDamageInfoBack}
				/>
			);
		} else if (attackState === AttackState.Result && attackRollResult) {
			return (
				<ResultState
					currentHistoryResult={getCurrentHistoryResult()}
					onAttackAgain={onAttackAgain}
				/>
			);
		}

		return (<>ERROR</>);
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