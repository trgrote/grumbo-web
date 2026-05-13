import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GetHighestHitRoll, GetHitCritStatus, IsCriticalHitOrMiss } from "./AttackSheet/AttackSheetStateFunctions";
import { HistoryRecord, HitRollStatus } from "./GloomStalkerTypes";
import { JSX } from "react";

const rollArrayToString = (arr: number[]) => '[' + arr.join(', ') + ']';
const diceArrayToString = (arr: number[]) => '[' + arr.map(die => `d${die}`).join(', ') + ']';
const joinWithElement = (arr: JSX.Element[], element: JSX.Element) => arr.flatMap((item, index) => index < arr.length - 1 ? [item, element] : [item]);

export default function AttackHistoryDetails({ historyRecord }: { historyRecord: HistoryRecord; }) {
	const { gloomStalkerInfo } = historyRecord;

	const hitStatus = GetHitCritStatus(historyRecord);
	const totalPiercingDamage = historyRecord.piercingDamageRolls.reduce((a, value) => a + value, 0)
		+ gloomStalkerInfo.damageModifier
		+ (historyRecord.applySharpShooterPenalty ? 10 : 0);
	const totalFireDamage = historyRecord.fireDamageRolls.reduce((a, value) => a + value, 0);
	const totalDamage = totalPiercingDamage + totalFireDamage;

	const isCriticalHitOrMiss = IsCriticalHitOrMiss(historyRecord);

	const damageSummary = (
		<>
			<li>
				<Label>Total Damage: {totalDamage}</Label>
			</li>
			<li>
				<Label>Total Piercing Damage: {totalPiercingDamage}</Label>
			</li>
			<li>
				<Label>Total Fire Damage: {totalFireDamage}</Label>
			</li>
			{hitStatus === HitRollStatus.CriticalHit && (
				<li>
					<Label>Apply 5 Damage to Adjacent Enemies</Label>
				</li>
			)}
		</>
	);

	const hitSummary = (
		<>
			<li>
				<Label>{isCriticalHitOrMiss ? 'Critical ' : ''}{historyRecord.isHit ? "Hit" : "Miss"}</Label>
			</li>
		</>
	);

	const highestHitRoll = GetHighestHitRoll(historyRecord);
	const totalHitValue = highestHitRoll + gloomStalkerInfo.attackModifier + (historyRecord.applySharpShooterPenalty ? -5 : 0);

	const toHitSummary = (
		<>
			<li>
				<Label>Total Hit Value: {totalHitValue} ({highestHitRoll} + {gloomStalkerInfo.attackModifier}{historyRecord.applySharpShooterPenalty ? ' - 5' : ''})</Label>
			</li>
			{historyRecord.hasAdvantage && (
				<li>
					<Label>Advantage (Rolled 3d20 due to Elven Accuracy)</Label>
				</li>
			)}
			<li>
				<Label>Hit Rolls: {rollArrayToString(historyRecord.attackRolls)}</Label>
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
		</>
	);

	const damageRolls = (
		<>
			<li>
				<Label>Weapon Damage: d{gloomStalkerInfo.damageDie} + {gloomStalkerInfo.damageModifier} (Piercing)</Label>
			</li>
			{hitStatus === HitRollStatus.CriticalHit && (
				<li>
					<Label>Piercer added 1d8 Piercing on Critical Hit</Label>
				</li>
			)}
			{historyRecord.applyHuntersMark && (
				<li>
					<Label>Hunter's Mark added 1d6 Piercing</Label>
				</li>
			)}
			{historyRecord.isDreadAmbusherExtraAttack && (
				<li>
					<Label>Dread Ambusher added 1d8 Piercing</Label>
				</li>
			)}
			<li>
				<Label>Piercing Damage Dice: {diceArrayToString(historyRecord.piercingDamageDicePool)}</Label>
			</li>
			<li>
				<Label>Piercing Damage Rolls: {rollArrayToString(historyRecord.piercingDamageRolls)}</Label>
			</li>
			<li>
				<Label>Fire Damage Dice: {diceArrayToString(historyRecord.fireDamageDicePool)}</Label>
			</li>
			<li>
				<Label>Fire Damage Rolls: {rollArrayToString(historyRecord.fireDamageRolls)}</Label>
			</li>
			{historyRecord.applySharpShooterPenalty && (
				<li>
					<Label>Sharp Shooter Bonus: +10 Piercing</Label>
				</li>
			)}
		</>
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
					{joinWithElement(detailArray, <li>&nbsp;</li>)}
				</ul>
			</CardContent>
		</Card>
	);
};