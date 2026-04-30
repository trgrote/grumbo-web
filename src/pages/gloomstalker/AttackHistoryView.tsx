import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HistoryRecord } from "./GloomStalkerTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface AttackHistoryViewProps {
	defaultOpen?: boolean;
	historyRecord: HistoryRecord;
}

const rollArrayToString = (arr: number[]) => '[' + arr.join(', ') + ']';
const diceArrayToString = (arr: number[]) => '[' + arr.map(die => `d${die}`).join(', ') + ']';

export default function AttackHistoryView({ defaultOpen, historyRecord }: AttackHistoryViewProps) {
	const { gloomStalkerInfo } = historyRecord;

	const highestHitRoll = Math.max(...historyRecord.attackRolls);
	const isCritical = highestHitRoll >= 20;
	const totalHitRoll = highestHitRoll
		+ gloomStalkerInfo.attackModifier
		- (historyRecord.applySharpShooterPenalty ? 5 : 0);
	const totalPiercingDamage = historyRecord.piercingDamageRolls.reduce((a, value) => a + value, 0)
		+ gloomStalkerInfo.damageModifier
		+ (historyRecord.applySharpShooterPenalty ? 10 : 0);
	const totalFireDamage = historyRecord.fireDamageRolls.reduce((a, value) => a + value, 0);
	const totalDamage = totalPiercingDamage + totalFireDamage;
	const hitValueTextColorClass = isCritical ? 'text-blue-500' : 'text-green-500';

	return (
		<Collapsible defaultOpen={defaultOpen ?? false} className="group/collapsible">
			<CollapsibleTrigger asChild className="w-full">
				<Button variant="ghost">
					<h3>
						To Hit: <span className={hitValueTextColorClass}>{totalHitRoll}</span>&nbsp;
						Damage: <span className="text-red-500">{historyRecord.isHit ? totalDamage : 0}</span>
					</h3>
					<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<Card>
					<CardContent>
						<ul>
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
								<Label>Critical Hit? <Checkbox disabled checked={isCritical} /></Label>
							</li>
							<li>
								<Label>Was Hit? <Checkbox disabled checked={historyRecord.isHit} /></Label>
							</li>
							{
								historyRecord.isHit &&
								<>
									<li>
										<Label>Piercing Damage Dice: {diceArrayToString(historyRecord.piercingDamageDicePool)}</Label>
									</li>
									<li>
										<Label>Piercing Damage Rolls: {rollArrayToString(historyRecord.piercingDamageRolls)}</Label>
									</li>
									<li>
										<Label>Total Piercing Damage: {totalPiercingDamage}</Label>
									</li>
									<li>
										<Label>Fire Damage Dice: {diceArrayToString(historyRecord.fireDamageDicePool)}</Label>
									</li>
									<li>
										<Label>Fire Damage Rolls: {rollArrayToString(historyRecord.fireDamageRolls)}</Label>
									</li>
									<li>
										<Label>Total Fire Damage: {totalFireDamage}</Label>
									</li>
									<li>
										<Label>Dread Ambusher Extra Attack? <Checkbox disabled checked={historyRecord.isDreadAmbusherExtraAttack} /></Label>
									</li>
									<li>
										<Label>Hunter's Mark? <Checkbox disabled checked={historyRecord.applyHuntersMark} /></Label>
									</li>
									<li>
										<Label>Apply 5 Damage to Adjacent Enemies? <Checkbox disabled checked={isCritical} /></Label>
									</li>
								</>
							}
						</ul>
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
}