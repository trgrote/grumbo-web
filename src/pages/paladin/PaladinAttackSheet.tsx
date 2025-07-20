import { RollAttack, RollDamage } from "./PaladinFunctions";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";
import { AttackRollResult, PaladinInfo, RollDamageResult, RollHistoryRecord } from "./PaladinTypes";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { usePaladinSound } from "./hooks/usePaladinSound";
import ResultState from "./AttackStates/ResultState";
import DamageInfoState from "./AttackStates/DamageInfoState";
import IsHitState from "./AttackStates/IsHitState";
import AttackInfoState from "./AttackStates/AttackInfoState";

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
				<AttackInfoState
					hasAdvantage={hasAdvantage}
					setHasAdvantage={setHasAdvantage}
					onRollForAttack={onRollForAttack}
				/>
			);
		} else if (attackState === AttackState.isHit && attackRollResult) {
			return (
				<IsHitState
					attackRollResult={attackRollResult}
					onAttackHit={onAttackHit}
					onAttackMiss={onAttackMiss}
					onIsHitBack={onIsHitBack}
				/>
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