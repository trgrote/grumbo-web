import { Input } from "@/components/ui/input";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";

const weaponDamageDice = [4, 6, 8, 10, 12];

export interface WeaponStatsFormProps {
	attackModifier: number;
	damageDie: number;
	damageModifier: number;
	onAttackModifierChange: (value: number) => void;
	onDamageDieChange: (value: number) => void;
	onDamageModifierChange: (value: number) => void;
}

export default function WeaponStatsForm({
	attackModifier,
	damageDie,
	damageModifier,
	onAttackModifierChange,
	onDamageDieChange,
	onDamageModifierChange,
}: WeaponStatsFormProps) {
	const handleAttackModifierChange = (newValue: number) => {
		if (Number.isNaN(newValue)) return;
		onAttackModifierChange(newValue);
	};

	const handleDamageDieChange = (newValue: number) => {
		if (Number.isNaN(newValue)) return;
		onDamageDieChange(newValue);
	};

	const handleDamageModifierChange = (newValue: number) => {
		if (Number.isNaN(newValue)) return;
		onDamageModifierChange(newValue);
	};

	return (
		<>
			<div>
				<label>
					Attack Modifier:
					<Input
						type="number"
						value={attackModifier}
						onChange={e => handleAttackModifierChange(parseInt(e.target.value))}
					/>
				</label>
			</div>
			<div>
				<label>
					Damage Die:
				</label>
				<ToggleGroup
					type="single"
					value={damageDie.toString()}
					onValueChange={newValue => handleDamageDieChange(parseInt(newValue))}
				>
					{
						weaponDamageDice.map((dieValue, i) =>
							<ToggleGroupItem key={i} value={dieValue.toString()}>
								d{dieValue}
							</ToggleGroupItem>
						)
					}
				</ToggleGroup>
			</div>
			<div>
				<label>
					Damage Modifier
					<Input
						type="number"
						value={damageModifier}
						onChange={e => handleDamageModifierChange(parseInt(e.target.value))}
					/>
				</label>
			</div>
		</>
	);
}
