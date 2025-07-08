import { useState } from "react";
import RollResultView from "./RollResultView";
import { Roll, RollResult } from "./Functions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";

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
		<>
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
					<Select
						value={spellSlotUsed.toString()}
						onValueChange={newValue => setSpellSlotUsed(parseInt(newValue))}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Spell Slot" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='0'>None</SelectItem>
							<SelectItem value='1'>1</SelectItem>
							<SelectItem value='2'>2</SelectItem>
							<SelectItem value='3'>3</SelectItem>
							<SelectItem value='4'>4+</SelectItem>
						</SelectContent>
					</Select>
				</label>
			</div>
			<Button onClick={onRollClick}>Roll</Button>
			<div style={{ height: 120, overflowY: 'auto' }}>
				{
					attackResults.map((attackResult, i) => <RollResultView key={i} {...attackResult} />)
				}
			</div>
			{attackResults.length > 0 && <Button onClick={() => setAttackResults([])}>Clear Rolls</Button>}
		</>
	);
}

export default Paladin;