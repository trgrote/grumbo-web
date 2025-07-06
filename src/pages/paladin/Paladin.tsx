import { useState } from "react";
import RollResultView from "./RollResultView";
import { Roll, RollResult } from "./Functions";

// TODO
// - Create Result Box
// - Maybe make the 'config' part a form
// - Create Result view to view all previous result history

function Paladin() {
	const [attackModifier, setAttackModifier] = useState(12);
	const [damageDie, setDamageDie] = useState(8);
	const [damageModifier, setDamageModifier] = useState(9);
	const [hasAdvantage, setHasAdvantage] = useState(false);
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
					Attack Modifier
					<input name="attackMod" type="number" value={attackModifier}
						onChange={e => setAttackModifier(parseInt(e.target.value))} />
				</label>
			</div>
			<div>
				<label>
					Damage Die
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
					Has Advantage
				</label>
			</div>
			<div>
				<label>
					<input name="hasImprovedDS" type="checkbox" checked={hasImprovedDS}
						onChange={() => setHasImprovedDS(!hasImprovedDS)} />
					Has Improved Divine Smite (automaticlly adds 1d8 Radiant Damage on any attack)
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
						<option value={4}>4</option>
						<option value={5}>5</option>
						<option value={6}>6</option>
						<option value={7}>7</option>
						<option value={8}>8</option>
						<option value={9}>9</option>
					</select>
				</label>
			</div>
			<button onClick={onRollClick}>Roll</button>
			<div style={{ height: 120, overflowY: 'auto' }}>
				{
					attackResults.map(attackResult => <RollResultView {...attackResult} />)
				}
			</div>

		</>
	);
}

export default Paladin;