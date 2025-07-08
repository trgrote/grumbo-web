import { useState } from "react";
import RollResultView from "./RollResultView";
import { Roll, RollResult } from "./Functions";

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
	const [hasAdvantage, setHasAdvantage] = useState(false);
	const [isTargetFiendOrUndead, setIsTargetFiendOrUndead] = useState(false);
	const [hasImprovedDS, setHasImprovedDS] = useState(true);
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
					<input name="attackMod" type="number" value={attackModifier}
						onChange={e => setAttackModifier(parseInt(e.target.value))} />
				</label>
			</div>
			<div>
				<label>
					Damage Die:
					<select
						value={damageDie}
						onChange={e => setDamageDie(parseInt(e.target.value))}>
						<option value={4}>d4</option>
						<option value={6}>d6</option>
						<option value={8}>d8</option>
						<option value={10}>d10</option>
						<option value={12}>d12</option>
					</select>
				</label>
			</div>
			<div>
				<label>
					Damage Modifier
					<input type="number" value={damageModifier}
						onChange={e => setDamageModifier(parseInt(e.target.value))} />
				</label>
			</div>
			<div>
				<label>
					<input name="hasAdvantage" type="checkbox" checked={hasAdvantage}
						onChange={() => setHasAdvantage(!hasAdvantage)} />
					Has Advantage?
				</label>
			</div>
			<div title="Adds 1d8 Radiant Damage on any attack against undead or fiends">
				<label>
					<input name="isTargetFiendOrUndead" type="checkbox" checked={isTargetFiendOrUndead}
						onChange={() => setIsTargetFiendOrUndead(!isTargetFiendOrUndead)} />
					Is Target Fiend or Undead?
				</label>
			</div>
			<div title="Automaticlly adds 1d8 Radiant Damage on any attack">
				<label>
					<input name="hasImprovedDS" type="checkbox" checked={hasImprovedDS}
						onChange={() => setHasImprovedDS(!hasImprovedDS)} />
					Has Improved Divine Smite?
				</label>
			</div>
			<div>
				<label>
					Spell Slot Used?
					<select name="spellSlotUsed"
						value={spellSlotUsed}
						onChange={e => setSpellSlotUsed(parseInt(e.target.value))}>
						<option value={0}>None</option>
						<option value={1}>1</option>
						<option value={2}>2</option>
						<option value={3}>3</option>
						<option value={4}>4+</option>
					</select>
				</label>
			</div>
			<button onClick={onRollClick}>Roll</button>
			<div style={{ height: 120, overflowY: 'auto' }}>
				{
					attackResults.map((attackResult, i) => <RollResultView key={i} {...attackResult} />)
				}
			</div>
			{attackResults.length > 0 && <button onClick={() => setAttackResults([])}>Clear Rolls</button>}
		</>
	);
}

export default Paladin;