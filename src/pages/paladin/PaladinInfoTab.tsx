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

export interface PaladinInfoTabProps {
	paladinInfo: PaladinInfo;
	onChange: (paladinInfo: PaladinInfo) => void;
	addToRollHistory: (result: RollHistoryRecord) => void;
}

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
						<ToggleGroupItem value='4'><div className="w-12">d4</div></ToggleGroupItem>
						<ToggleGroupItem value='6'><div className="w-12">d6</div></ToggleGroupItem>
						<ToggleGroupItem value='8'><div className="w-12">d8</div></ToggleGroupItem>
						<ToggleGroupItem value='10'><div className="w-12">d10</div></ToggleGroupItem>
						<ToggleGroupItem value='12'><div className="w-12">d12</div></ToggleGroupItem>
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
			</CardContent>
			<CardFooter>
				<PaladinAttackSheet paladinInfo={paladinInfo} addToRollHistory={addToRollHistory} />
			</CardFooter>
		</Card>
	);
}