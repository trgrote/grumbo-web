import { Checkbox } from "@/components/ui/checkbox";
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
import WeaponStatsForm from "@/components/WeaponStatsForm";

export interface PaladinInfoTabProps {
	paladinInfo: PaladinInfo;
	onChange: (paladinInfo: PaladinInfo) => void;
	addToRollHistory: (result: RollHistoryRecord) => void;
}

export default function PaladinInfoTab({ paladinInfo, onChange, addToRollHistory }: PaladinInfoTabProps) {
	const { attackModifier, damageDie, damageModifier, hasImprovedDS } = paladinInfo;

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
				<WeaponStatsForm
					attackModifier={attackModifier}
					damageDie={damageDie}
					damageModifier={damageModifier}
					onAttackModifierChange={(newValue) =>
						onChange({
							...paladinInfo,
							attackModifier: newValue
						})
					}
					onDamageDieChange={(newValue) =>
						onChange({
							...paladinInfo,
							damageDie: newValue
						})
					}
					onDamageModifierChange={(newValue) =>
						onChange({
							...paladinInfo,
							damageModifier: newValue
						})
					}
				/>
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