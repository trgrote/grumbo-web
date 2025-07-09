import { useState } from "react";
import PaladinHistoryTab from "./PaladinHistoryTab";
import { Roll, RollResult } from "./Functions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import PaladinInfoTab, { PaladinInfo } from "./PaladinInfoTab";

// TODO
// - Save History in local storage
// - Maybe make the 'config' part a form
// - Update logic to allow spell slots to be selected after attack roll.
// - Add input validation to only allow integers for modifier fields
// - Space Fields better

/**
 * 
 * When you hit with a melee weapon attack, you can expend one spell slot to deal 2d8 extra radiant damage to the target plus 1d8 for each spell level higher than 1st (max 5d8) and plus 1d8 against undead or fiends.
 */

function Paladin() {
	const [paladinInfo, setPaladinInfo] = useState<PaladinInfo>({
		attackModifier: 12,
		damageDie: 8,
		damageModifier: 9,
		hasImprovedDS: true
	});

	const [hasAdvantage, setHasAdvantage] = useState(false);

	const [isTargetFiendOrUndead, setIsTargetFiendOrUndead] = useState(false);
	const [spellSlotUsed, setSpellSlotUsed] = useState(0);

	const [attackResults, setAttackResults] = useState<RollResult[]>([]);

	const onRollClick = () => {
		const roll = Roll({
			...paladinInfo,
			hasAdvantage,
			spellSlotUsed
		});

		setAttackResults([roll, ...attackResults]);
	};

	return (
		<Tabs defaultValue="paladinInfo">
			<TabsList>
				<TabsTrigger value="paladinInfo">Paladin Info</TabsTrigger>
				<TabsTrigger value="attack">Attack</TabsTrigger>
				<TabsTrigger value="history">History</TabsTrigger>
			</TabsList>
			<TabsContent value="paladinInfo">
				<PaladinInfoTab paladinInfo={paladinInfo} onChange={setPaladinInfo} />
			</TabsContent>
			<TabsContent value="attack">
				<Card>
					<CardHeader>
						<CardTitle>Attack Info</CardTitle>
						<CardDescription>Set Attack Info</CardDescription>
					</CardHeader>
					<CardContent>
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