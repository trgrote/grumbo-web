import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GetHitRollStatus } from "./AttackSheet/AttackSheetStateFunctions";
import { HistoryRecord, HitRollStatus } from "./GloomStalkerTypes";

const rollArrayToString = (arr: number[]) => '[' + arr.join(', ') + ']';
const diceArrayToString = (arr: number[]) => '[' + arr.map(die => `d${die}`).join(', ') + ']';

export default function AttackHistoryDetails({ historyRecord }: { historyRecord: HistoryRecord; }) {
	const { gloomStalkerInfo } = historyRecord;

	const hitStatus = GetHitRollStatus(historyRecord.attackRolls);
	const totalPiercingDamage = historyRecord.piercingDamageRolls.reduce((a, value) => a + value, 0)
		+ gloomStalkerInfo.damageModifier
		+ (historyRecord.applySharpShooterPenalty ? 10 : 0);
	const totalFireDamage = historyRecord.fireDamageRolls.reduce((a, value) => a + value, 0);
	const totalDamage = totalPiercingDamage + totalFireDamage;

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

	const damageRolls = (
		<>
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
		</>
	);

	return (
		<Card>
			<CardContent>
				<ul>
					{historyRecord.isHit && damageSummary}
					<li>
						<Label>Attack Modifier: +{gloomStalkerInfo.attackModifier}</Label>
					</li>
					<li>
						<Label>Weapon Stats: d{gloomStalkerInfo.damageDie} + {gloomStalkerInfo.damageModifier}</Label>
					</li>
					<li>
						<Label>Had Advantage? <Checkbox disabled checked={historyRecord.hasAdvantage} /></Label>
					</li>
					<li>
						<Label>Applied Sharp Shooter? <Checkbox disabled checked={historyRecord.applySharpShooterPenalty} /></Label>
					</li>
					<li>
						<Label>To Hit Rolls: {rollArrayToString(historyRecord.attackRolls)}</Label>
					</li>
					<li>
						<Label>Critical Hit? <Checkbox disabled checked={hitStatus === HitRollStatus.CriticalHit} /></Label>
					</li>
					<li>
						<Label>Was Hit? <Checkbox disabled checked={historyRecord.isHit} /></Label>
					</li>
					{historyRecord.isHit && damageRolls}
					{historyRecord.isHit &&
						<>
							<li>
								<Label>Dread Ambusher Extra Attack? <Checkbox disabled checked={historyRecord.isDreadAmbusherExtraAttack} /></Label>
							</li>
							<li>
								<Label>Hunter's Mark? <Checkbox disabled checked={historyRecord.applyHuntersMark} /></Label>
							</li>
						</>}
				</ul>
			</CardContent>
		</Card>
	);
};