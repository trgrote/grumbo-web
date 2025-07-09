import { useState } from "react";
import PaladinHistoryTab from "./PaladinHistoryTab";
import { Roll, RollResult } from "./Functions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// TODO
// - Save History in local storage
// - Maybe make the 'config' part a form
// - Update logic to allow spell slots to be selected after attack roll.
// - Add Max 5d8 for spells slots (which I think is just spell slot 4).
// - Add toggle for against fields/undex because that will also add a 1d8 radiant
// - Add input validation to only allow integers for modifier fields

/**
 * 
 * When you hit with a melee weapon attack, you can expend one spell slot to deal 2d8 extra radiant damage to the target plus 1d8 for each spell level higher than 1st (max 5d8) and plus 1d8 against undead or fiends.
 */

function Paladin() {
	const [attackModifier, setAttackModifier] = useState(12);
	const [damageDie, setDamageDie] = useState(8);
	const [damageModifier, setDamageModifier] = useState(9);
	const [hasImprovedDS, setHasImprovedDS] = useState(true);

	const [hasAdvantage, setHasAdvantage] = useState(false);

	const [isTargetFiendOrUndead, setIsTargetFiendOrUndead] = useState(false);
	const [spellSlotUsed, setSpellSlotUsed] = useState(0);

	const [attackResults, setAttackResults] = useState<RollResult[]>([]);

	const onRollClick = () => {
		const roll = Roll({
			attackModifier,
			damageDie,
			damageModifier,
			hasAdvantage,
			hasImprovedDS,
			spellSlotUsed
		});

		setAttackResults([roll, ...attackResults]);
	};

	return (
		<Tabs defaultValue="attack">
			<TabsList>
				<TabsTrigger value="attack">Attack</TabsTrigger>
				<TabsTrigger value="history">History</TabsTrigger>
			</TabsList>
			<TabsContent value="attack">
				<Card>
					<CardHeader>
						<CardTitle>Paladin Info</CardTitle>
						<CardDescription>Set Paladin Info</CardDescription>
					</CardHeader>
					<CardContent>
						<div>
							<label>
								Attack Modifier:
								<Input type="number" value={attackModifier}
									onChange={e => setAttackModifier(parseInt(e.target.value))} />
							</label>
						</div>
						<div>
							<label>
								Damage Die:
							</label>
							<ToggleGroup type="single"
								value={damageDie.toString()}
								onValueChange={newValue => setDamageDie(parseInt(newValue))}>
								<ToggleGroupItem value='4'>d4</ToggleGroupItem>
								<ToggleGroupItem value='6'>d6</ToggleGroupItem>
								<ToggleGroupItem value='8'>d8</ToggleGroupItem>
								<ToggleGroupItem value='10'>d10</ToggleGroupItem>
								<ToggleGroupItem value='12'>d12</ToggleGroupItem>
							</ToggleGroup>
						</div>
						<div>
							<label>
								Damage Modifier
								<Input type="number" value={damageModifier}
									onChange={e => setDamageModifier(parseInt(e.target.value))} />
							</label>
						</div>
						<div title="Automaticlly adds 1d8 Radiant Damage on any attack">
							<label>
								<Checkbox name="hasImprovedDS" checked={hasImprovedDS}
									onCheckedChange={() => setHasImprovedDS(!hasImprovedDS)} />
								Has Improved Divine Smite?
							</label>
						</div>
						<div>
							<label>
								<Checkbox name="hasAdvantage" checked={hasAdvantage}
									onCheckedChange={() => setHasAdvantage(!hasAdvantage)} />
								Has Advantage?
							</label>
						</div>
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
					</CardContent>
					<CardFooter>
						<Button onClick={onRollClick}>Roll</Button>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value="history">
				<PaladinHistoryTab attackResults={attackResults} onClearHistory={() => setAttackResults([])} />
			</TabsContent>
		</Tabs>
	);
}

export default Paladin;