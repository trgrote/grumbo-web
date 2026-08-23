import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	GetDivineSmiteDamageDicePool,
	GetHighestAttackRoll,
	GetHighestAttackValue,
	GetHitStatusText,
	GetIsCritical,
	GetTotalDamage,
	GetTotalDivineSmiteDamage,
	GetTotalWeaponDamage,
	GetWeaponDamageDicePool,
	SpellSlotToString,
} from "./AttackSheet/AttackSheetStateFunctions";
import { HistoryRecord } from "./PaladinTypes";
import { Fragment, JSX } from "react";
import { DetailSectionKey, DiceArrayToString, GetDetailSectionOrder, JoinWithElement, RollArrayToString } from "@/utils/Formatting";

export default function AttackHistoryDetails({ historyRecord }: { historyRecord: HistoryRecord; }) {
	const { paladinInfo } = historyRecord;

	const isCritical = GetIsCritical(historyRecord);
	const totalWeaponDamage = GetTotalWeaponDamage(historyRecord);
	const totalDivineSmiteDamage = GetTotalDivineSmiteDamage(historyRecord);
	const totalDamage = GetTotalDamage(historyRecord);

	const damageSummary = (
		<Fragment key="damageSummary">
			<li>
				<Label>Total Damage: {totalDamage}</Label>
			</li>
			<li>
				<Label>Total Slashing Damage: {totalWeaponDamage}</Label>
			</li>
			<li>
				<Label>Total Radiant Damage: {totalDivineSmiteDamage}</Label>
			</li>
		</Fragment>
	);

	const hitSummary = (
		<Fragment key="hitSummary">
			<li>
				<Label>{GetHitStatusText(historyRecord)}</Label>
			</li>
		</Fragment>
	);

	const highestHitRoll = GetHighestAttackRoll(historyRecord);
	const totalHitValue = GetHighestAttackValue(historyRecord);

	const toHitSummary = (
		<Fragment key="toHitSummary">
			<li>
				<Label>Total Hit Value: {totalHitValue} ({highestHitRoll} + {paladinInfo.attackModifier})</Label>
			</li>
			{historyRecord.hasAdvantage && (
				<li>
					<Label>Advantage (Rolled 2d20)</Label>
				</li>
			)}
			<li>
				<Label>Hit Rolls: {RollArrayToString(historyRecord.attackRolls)}</Label>
			</li>
			<li>
				<Label>Highest Hit Roll: {highestHitRoll}</Label>
			</li>
			<li>
				<Label>Hit Modifier: +{paladinInfo.attackModifier}</Label>
			</li>
		</Fragment>
	);

	const damageRolls = (
		<Fragment key="damageRolls">
			<li>
				<Label>Weapon Damage: d{paladinInfo.damageDie} + {paladinInfo.damageModifier} (Slashing)</Label>
			</li>
			{isCritical && (
				<li>
					<Label>Critical Hit doubled the damage dice</Label>
				</li>
			)}
			{paladinInfo.hasImprovedDS && (
				<li>
					<Label>Improved Divine Smite added 1d8 Radiant</Label>
				</li>
			)}
			{historyRecord.isTargetFiendOrUndead && (
				<li>
					<Label>Fiend or Undead target added 1d8 Radiant</Label>
				</li>
			)}
			{historyRecord.spellSlotUsed > 0 && (
				<li>
					<Label>Level {SpellSlotToString(historyRecord.spellSlotUsed)} Spell Slot added {historyRecord.spellSlotUsed + 1}d8 Radiant</Label>
				</li>
			)}
			<li>
				<Label>Slashing Damage Dice: {DiceArrayToString(GetWeaponDamageDicePool(historyRecord))}</Label>
			</li>
			<li>
				<Label>Slashing Damage Rolls: {RollArrayToString(historyRecord.weaponDamageRolls)}</Label>
			</li>
			<li>
				<Label>Radiant Damage Dice: {DiceArrayToString(GetDivineSmiteDamageDicePool(historyRecord))}</Label>
			</li>
			<li>
				<Label>Radiant Damage Rolls: {RollArrayToString(historyRecord.divineSmiteDamageRolls)}</Label>
			</li>
		</Fragment>
	);

	const sectionsByKey: Record<DetailSectionKey, JSX.Element> = {
		hitSummary,
		damageSummary,
		toHitSummary,
		damageRolls,
	};

	const detailArray = GetDetailSectionOrder(historyRecord.isHit).map(key => sectionsByKey[key]);

	return (
		<Card>
			<CardContent>
				<ul>
					{JoinWithElement(detailArray, <li>&nbsp;</li>)}
				</ul>
			</CardContent>
		</Card>
	);
};
