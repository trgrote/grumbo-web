import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	GetHighestHitRoll,
	GetHighestHitValue,
	GetCritStatus,
	GetFavoredEnemyBonus,
	GetHitStatusText,
	GetTotalDamage,
	GetTotalFireDamage,
	GetTotalForceDamage,
	GetTotalPiercingDamage,
} from "./AttackSheet/AttackSheetStateFunctions";
import { HistoryRecord, CritStatus } from "./GloomStalkerTypes";
import { Fragment } from "react";
import { DiceArrayToString, JoinWithElement, RollArrayToString } from "@/utils/Formatting";

export default function AttackHistoryDetails({ historyRecord }: { historyRecord: HistoryRecord; }) {
	const { gloomStalkerInfo } = historyRecord;

	const hitStatus = GetCritStatus(historyRecord);
	const favoredEnemyBonus = GetFavoredEnemyBonus(historyRecord);
	const totalPiercingDamage = GetTotalPiercingDamage(historyRecord);
	const totalFireDamage = GetTotalFireDamage(historyRecord);
	const totalForceDamage = GetTotalForceDamage(historyRecord);
	const totalDamage = GetTotalDamage(historyRecord);

	const damageSummary = (
		<Fragment key="damageSummary">
			<li>
				<Label>Total Damage: {totalDamage}</Label>
			</li>
			<li>
				<Label>Total Piercing Damage: {totalPiercingDamage}</Label>
			</li>
			<li>
				<Label>Total Fire Damage: {totalFireDamage}</Label>
			</li>
			<li>
				<Label>Total Force Damage: {totalForceDamage}</Label>
			</li>
			{hitStatus === CritStatus.CriticalHit && (
				<li>
					<Label>Apply 5 Damage to Adjacent Enemies</Label>
				</li>
			)}
		</Fragment>
	);

	const hitSummary = (
		<Fragment key="hitSummary">
			<li>
				<Label>{GetHitStatusText(historyRecord)}</Label>
			</li>
		</Fragment>
	);

	const highestHitRoll = GetHighestHitRoll(historyRecord);
	const totalHitValue = GetHighestHitValue(historyRecord);

	const toHitSummary = (
		<Fragment key="toHitSummary">
			<li>
				<Label>Total Hit Value: {totalHitValue} ({highestHitRoll} + {gloomStalkerInfo.attackModifier}{historyRecord.applySharpShooterPenalty ? ' - 5' : ''}{favoredEnemyBonus > 0 ? ` + ${favoredEnemyBonus}` : ''})</Label>
			</li>
			{historyRecord.hasAdvantage && (
				<li>
					<Label>Advantage (Rolled 3d20 due to Elven Accuracy)</Label>
				</li>
			)}
			<li>
				<Label>Hit Rolls: {RollArrayToString(historyRecord.attackRolls)}</Label>
			</li>
			<li>
				<Label>Highest Hit Roll: {highestHitRoll}</Label>
			</li>
			<li>
				<Label>Hit Modifier: +{gloomStalkerInfo.attackModifier}</Label>
			</li>
			{historyRecord.applySharpShooterPenalty && (
				<li>
					<Label>Sharp Shooter Penalty: -5</Label>
				</li>
			)}
			{historyRecord.selectedFavoredEnemies.length > 0 && (
				<li>
					<Label>Favored Enemy Bonus: +{favoredEnemyBonus} ({historyRecord.selectedFavoredEnemies.join(', ')})</Label>
				</li>
			)}
		</Fragment>
	);

	const damageRolls = (
		<Fragment key="damageRolls">
			<li>
				<Label>Weapon Damage: d{gloomStalkerInfo.damageDie} + {gloomStalkerInfo.damageModifier} (Piercing)</Label>
			</li>
			{hitStatus === CritStatus.CriticalHit && (
				<li>
					<Label>Piercer added 1d8 Piercing on Critical Hit</Label>
				</li>
			)}
			{historyRecord.applyHuntersMark && (
				<li>
					<Label>Hunter's Mark added 1d6 Force</Label>
				</li>
			)}
			{historyRecord.isDreadAmbusherExtraAttack && (
				<li>
					<Label>Dread Ambusher added 1d8 Piercing</Label>
				</li>
			)}
			<li>
				<Label>Piercing Damage Dice: {DiceArrayToString(historyRecord.piercingDamageDicePool)}</Label>
			</li>
			<li>
				<Label>Piercing Damage Rolls: {RollArrayToString(historyRecord.piercingDamageRolls)}</Label>
			</li>
			<li>
				<Label>Fire Damage Dice: {DiceArrayToString(historyRecord.fireDamageDicePool)}</Label>
			</li>
			<li>
				<Label>Fire Damage Rolls: {RollArrayToString(historyRecord.fireDamageRolls)}</Label>
			</li>
			<li>
				<Label>Force Damage Dice: {DiceArrayToString(historyRecord.forceDamageDicePool)}</Label>
			</li>
			<li>
				<Label>Force Damage Rolls: {RollArrayToString(historyRecord.forceDamageRolls)}</Label>
			</li>
			{historyRecord.applySharpShooterPenalty && (
				<li>
					<Label>Sharp Shooter Bonus: +10 Piercing</Label>
				</li>
			)}
			{historyRecord.selectedFavoredEnemies.length > 0 && (
				<li>
					<Label>Favored Enemy Bonus: +{favoredEnemyBonus} Piercing ({historyRecord.selectedFavoredEnemies.join(', ')})</Label>
				</li>
			)}
		</Fragment>
	);

	// Build the detail array in the order we want to display the details, and conditionally include details based on the history record properties
	const detailArray = [hitSummary];

	if (historyRecord.isHit) {
		detailArray.push(damageSummary);
	}

	detailArray.push(toHitSummary);

	if (historyRecord.isHit) {
		detailArray.push(damageRolls);
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