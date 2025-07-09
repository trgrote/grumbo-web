import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RollAttack, RollDamage } from "./PaladinFunctions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useState } from "react";
import { AttackRollResult, PaladinInfo, RollDamageResult, RollHistoryRecord } from "./PaladinTypes";
import RollResultView from "./RollResultView";

export interface PaladinAttackTabProps {
	paladinInfo: PaladinInfo;
	addToRollHistory: (result: RollHistoryRecord) => void;
}

enum AttackState {
	AttackInfo,
	isHit,
	DamageInfo,
	Result
}

export default function PaladinAttackTab({ paladinInfo, addToRollHistory }: PaladinAttackTabProps) {
	const [attackState, setAttackState] = useState(AttackState.AttackInfo);

	const [hasAdvantage, setHasAdvantage] = useState(false);

	const [attackRollResult, setAttackRollResult] = useState<AttackRollResult | null>(null);

	const [isTargetFiendOrUndead, setIsTargetFiendOrUndead] = useState(false);
	const [spellSlotUsed, setSpellSlotUsed] = useState(0);

	const [damageRollResult, setDamageRollResult] = useState<RollDamageResult | null>(null);

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

		addToRollHistory({
			...attackRollResult,
			weaponDamageRolls: [],
			divineSmiteDamageRolls: []
		});
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

		addToRollHistory({
			...attackRollResult,
			...damageResult
		});

		setDamageRollResult(damageResult);
		setAttackState(AttackState.Result);
	};

	const onAttackAgain = () => {
		setAttackState(AttackState.AttackInfo);
	};

	const renderState = () => {
		switch (attackState) {
			case AttackState.AttackInfo:
				return (
					<>
						<label>
							<Checkbox name="hasAdvantage" checked={hasAdvantage}
								onCheckedChange={() => setHasAdvantage(!hasAdvantage)} />
							Has Advantage?
						</label>
						<Button onClick={onRollForAttack}>Roll for Attack</Button>
					</>
				);
			case AttackState.isHit: {
				if (!attackRollResult) {
					return <></>;
				}

				const toHitvalue = Math.max(...attackRollResult.toHitValues);

				return (
					<>
						Did Attack Hit?
						<strong>{toHitvalue}</strong>
						<Button variant="secondary" onClick={onAttackMiss}>Missed</Button>
						<Button onClick={onAttackHit}>Hit</Button>
					</>
				);
			}
			case AttackState.DamageInfo:
				return (
					<>
						<div title="Adds 1d8 Radiant Damage on any attack against undead or fiends">
							<label>
								<Checkbox name="isTargetFiendOrUndead" checked={isTargetFiendOrUndead}
									onCheckedChange={() => setIsTargetFiendOrUndead(!isTargetFiendOrUndead)} />
								Is Target Fiend or Undead?
							</label>
						</div>
						<div>
							<label>
								Spell Slot Used?
							</label>
							<ToggleGroup type="single"
								value={spellSlotUsed.toString()}
								onValueChange={newValue => setSpellSlotUsed(parseInt(newValue))}>
								<ToggleGroupItem value='0'><div className="w-12">None</div></ToggleGroupItem>
								<ToggleGroupItem value='1'><div className="w-12">1</div></ToggleGroupItem>
								<ToggleGroupItem value='2'><div className="w-12">2</div></ToggleGroupItem>
								<ToggleGroupItem value='3'><div className="w-12">3</div></ToggleGroupItem>
								<ToggleGroupItem value='4'><div className="w-12">4+</div></ToggleGroupItem>
							</ToggleGroup>
						</div>
						<Button onClick={onRollForDamage}>Roll For Damage</Button>
					</>
				);
			case AttackState.Result: {
				if (!attackRollResult || !damageRollResult) {
					return <></>;
				}

				return (
					<>
						Damage Results
						<RollResultView
							{...attackRollResult}
							{...damageRollResult}
						/>
						<Button onClick={onAttackAgain}>Attack Again</Button>
					</>
				);
			}
			default:
				return (<></>);
		}

		return (<></>);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Attack Info</CardTitle>
				<CardDescription>Set Attack Info</CardDescription>
			</CardHeader>
			<CardContent>
				{renderState()}
			</CardContent>
			<CardFooter>
			</CardFooter>
		</Card>
	);
}