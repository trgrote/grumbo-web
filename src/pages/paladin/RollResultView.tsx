import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@radix-ui/react-label";
import { ChevronDown } from "lucide-react";
import { RollHistoryRecord } from "./PaladinTypes";
import { SpellSlotToString } from "./PaladinFunctions";

interface RollResultProps extends RollHistoryRecord {
	defaultOpen?: boolean;
};

const rollArrayToString = (arr: number[]) => '[' + arr.join(', ') + ']';

const RollResultView = (props: RollResultProps) => {
	const { toHitValues, weaponDamageRolls, divineSmiteDamageRolls, defaultOpen } = props;

	const maxAttackRoll = Math.max(...toHitValues);

	const totalWeaponDamage = weaponDamageRolls.reduce((a, value) => a + value, 0);
	const totalDSDamage = divineSmiteDamageRolls.reduce((a, value) => a + value, 0);
	const totalDamage = totalWeaponDamage + totalDSDamage;

	const hitValueTextColorClass = props.isCritical ? 'text-blue-500' : 'text-green-500';

	return (
		<Collapsible defaultOpen={defaultOpen ?? false} className="group/collapsible">
			<CollapsibleTrigger asChild className="w-full">
				<Button variant="ghost">
					<h3>
						To Hit: <span className={hitValueTextColorClass}>{maxAttackRoll}</span>&nbsp;
						Damage: <span className="text-red-500">{totalDamage}</span>
					</h3>
					<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<Card>
					<CardContent>
						<ul>
							<li>
								<Label>Attack Modifier: {props.attackModifier}</Label>
							</li>
							<li>
								<Label>Weapon Stats: d{props.damageDie} + {props.damageModifier}</Label>
							</li>
							<li>
								<Label>Improved Divine Smite: <Checkbox disabled checked={props.hasImprovedDS} /></Label>
							</li>
							<li>
								<Label>Had Advantage: <Checkbox disabled checked={props.hasAdvantage} /></Label>
							</li>
							<li>
								<Label>To Hit Rolls: {rollArrayToString(props.toHitValues)}</Label>
							</li>
							<li>
								<Label>Critical Hit: <Checkbox disabled checked={props.isCritical} /></Label>
							</li>
							<li>
								<Label>Was Hit: <Checkbox disabled checked={props.isHit} /></Label>
							</li>
							{
								props.isHit &&
								<>
									<li>
										<Label>Was Target Fiend or Undead: <Checkbox disabled checked={props.isTargetFiendOrUndead} /></Label>
									</li>
									<li>
										<Label>Weapon Rolls: {rollArrayToString(props.weaponDamageRolls)}</Label>
									</li>
									<li>
										<Label>Total Weapon Damage: {totalWeaponDamage}</Label>
									</li>
									<li>
										<Label>Spell Slot Used: {SpellSlotToString(props.spellSlotUsed)}</Label>
									</li>
									<li>
										<Label>Divine Smite Rolls: {rollArrayToString(props.divineSmiteDamageRolls)}</Label>
									</li>
									<li>
										<Label>Total Divine Smite Damage: {totalDSDamage}</Label>
									</li>
								</>
							}
						</ul>
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
};

export default RollResultView;