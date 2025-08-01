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
import { PaladinInfo, RollHistoryRecord } from "./PaladinTypes";
import PaladinAttackSheet from "./PaladinAttackSheet";
import { Label } from "@/components/ui/label";

export interface PaladinInfoTabProps {
	paladinInfo: PaladinInfo;
	onChange: (paladinInfo: PaladinInfo) => void;
	addToRollHistory: (result: RollHistoryRecord) => void;
}

const weaponDamageDice = [4, 6, 8, 10, 12];

export default function PaladinInfoTab({ paladinInfo, onChange, addToRollHistory }: PaladinInfoTabProps) {
	const { attackModifier, damageDie, damageModifier, hasImprovedDS } = paladinInfo;

	const setAttackModifier = (newValue: number) => {
		onChange({
			...paladinInfo,
			attackModifier: newValue
		});
	};

	const setDamageDie = (newValue: number) => {
		onChange({
			...paladinInfo,
			damageDie: newValue
		});
	};

	const setDamageModifier = (newValue: number) => {
		onChange({
			...paladinInfo,
			damageModifier: newValue
		});
	};

	const setHasImprovedDS = (newValue: boolean) => {
		onChange({
			...paladinInfo,
			hasImprovedDS: newValue
		});
	};

	return (
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
						<Input type="number" value={damageModifier}
							onChange={e => setDamageModifier(parseInt(e.target.value))} />
					</label>
				</div>
				<div title="Automaticlly adds 1d8 Radiant Damage on any attack">
					<Label htmlFor="hasImprovedDS">
						<Checkbox id="hasImprovedDS" checked={hasImprovedDS}
							onCheckedChange={() => setHasImprovedDS(!hasImprovedDS)} />
						Has Improved Divine Smite?
					</Label>
				</div>
			</CardContent>
			<CardFooter>
				<PaladinAttackSheet paladinInfo={paladinInfo} addToRollHistory={addToRollHistory} />
			</CardFooter>
		</Card>
	);
}