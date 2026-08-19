import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Fragment } from "react";
import { HistoryRecord } from "./PaladinTypes";
import { GetHitStatusText, GetTotalDivineSmiteDamage, GetTotalWeaponDamage, SpellSlotToString } from "./AttackSheet/AttackSheetStateFunctions";
import { JoinWithElement, RollArrayToString } from "@/utils/Formatting";

export default function AttackHistoryDetails({ historyRecord }: { historyRecord: HistoryRecord; }) {
	const { paladinInfo } = historyRecord;

	const totalWeaponDamage = GetTotalWeaponDamage(historyRecord);
	const totalDivineSmiteDamage = GetTotalDivineSmiteDamage(historyRecord);

	const hitSummary = (
		<Fragment key="hitSummary">
			<li>
				<Label>Attack Modifier: {paladinInfo.attackModifier}</Label>
			</li>
			<li>
				<Label>Weapon Stats: d{paladinInfo.damageDie} + {paladinInfo.damageModifier}</Label>
			</li>
			<li>
				<Label>Improved Divine Smite: <Checkbox disabled checked={paladinInfo.hasImprovedDS} /></Label>
			</li>
			<li>
				<Label>Had Advantage: <Checkbox disabled checked={historyRecord.hasAdvantage} /></Label>
			</li>
			<li>
				<Label>To Hit Rolls: {RollArrayToString(historyRecord.attackRolls)}</Label>
			</li>
			<li>
				<Label>{GetHitStatusText(historyRecord)}</Label>
			</li>
		</Fragment>
	);

	const damageDetails = (
		<Fragment key="damageDetails">
			<li>
				<Label>Was Target Fiend or Undead: <Checkbox disabled checked={historyRecord.isTargetFiendOrUndead} /></Label>
			</li>
			<li>
				<Label>Weapon Rolls: {RollArrayToString(historyRecord.weaponDamageRolls)}</Label>
			</li>
			<li>
				<Label>Total Weapon Damage: {totalWeaponDamage}</Label>
			</li>
			<li>
				<Label>Spell Slot Used: {SpellSlotToString(historyRecord.spellSlotUsed)}</Label>
			</li>
			<li>
				<Label>Divine Smite Rolls: {RollArrayToString(historyRecord.divineSmiteDamageRolls)}</Label>
			</li>
			<li>
				<Label>Total Divine Smite Damage: {totalDivineSmiteDamage}</Label>
			</li>
		</Fragment>
	);

	const detailArray = [hitSummary];

	if (historyRecord.isHit) {
		detailArray.push(damageDetails);
	}

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
