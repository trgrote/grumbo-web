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
import { Label } from "@/components/ui/label";
import { GloomStalkerInfo, HistoryRecord } from "./GloomStalkerTypes";
import GloomStalkerAttackSheet from "./GloomStalkerAttackSheet";

export interface GloomStalkerInfoCardProps {
	gloomStalkerInfo: GloomStalkerInfo;
	onChange: (gloomStalkerInfo: GloomStalkerInfo) => void;
	addToHistory: (historyRecord: HistoryRecord) => void;
}

const weaponDamageDice = [4, 6, 8, 10, 12];

export default function GloomStalkerInfoCard({ gloomStalkerInfo, onChange, addToHistory }: GloomStalkerInfoCardProps) {
	const {
		attackModifier,
		damageDie,
		damageModifier,
		hasStalkersFlurry,
		hasPiercer,
		hasElvenAccuracy,
		hasDragonsWrathLongbowStirring,
	} = gloomStalkerInfo;

	const setAttackModifier = (newValue: number) => {
		onChange({
			...gloomStalkerInfo,
			attackModifier: newValue
		});
	};

	const setDamageDie = (newValue: number) => {
		onChange({
			...gloomStalkerInfo,
			damageDie: newValue
		});
	};

	const setDamageModifier = (newValue: number) => {
		onChange({
			...gloomStalkerInfo,
			damageModifier: newValue
		});
	};

	const setHasStalkersFlurry = (newValue: boolean) => {
		onChange({
			...gloomStalkerInfo,
			hasStalkersFlurry: newValue
		});
	};

	const setHasPiercer = (newValue: boolean) => {
		onChange({
			...gloomStalkerInfo,
			hasPiercer: newValue
		});
	};

	const setHasElvenAccuracy = (newValue: boolean) => {
		onChange({
			...gloomStalkerInfo,
			hasElvenAccuracy: newValue
		});
	};

	const setHasDragonsWrathLongbowStirring = (newValue: boolean) => {
		onChange({
			...gloomStalkerInfo,
			hasDragonsWrathLongbowStirring: newValue
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>GloomStalker Info</CardTitle>
				<CardDescription>Set GloomStalker Info</CardDescription>
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
				<div title="Once on each of your turns when you miss with a weapon attack, you can make another weapon attack as part of the same action.">
					<Label htmlFor="hasStalkersFlurry">
						<Checkbox id="hasStalkersFlurry" checked={hasStalkersFlurry}
							onCheckedChange={() => setHasStalkersFlurry(!hasStalkersFlurry)} />
						Has Stalker's Flurry?
					</Label>
				</div>
				<div title="Once per turn, you can reroll one of the attack's damage dice. On a critical hit, roll one additional damage die.">
					<Label htmlFor="hasPiercer">
						<Checkbox id="hasPiercer" checked={hasPiercer}
							onCheckedChange={() => setHasPiercer(!hasPiercer)} />
						Has Piercer?
					</Label>
				</div>
				<div title="Whenever you have advantage on an attack roll, you can reroll one of the dice once.">
					<Label htmlFor="hasElvenAccuracy">
						<Checkbox id="hasElvenAccuracy" checked={hasElvenAccuracy}
							onCheckedChange={() => setHasElvenAccuracy(!hasElvenAccuracy)} />
						Has Elven Accuracy?
					</Label>
				</div>
				<div title="Whenever you roll a 20 on your attack roll with this weapon, each creature of your choice within 5 feet of the target takes 5 piercing damage. On a hit, the weapon deals an extra 1d6 piercing damage.">
					<Label htmlFor="hasDragonsWrathLongbowStirring">
						<Checkbox id="hasDragonsWrathLongbowStirring" checked={hasDragonsWrathLongbowStirring}
							onCheckedChange={() => setHasDragonsWrathLongbowStirring(!hasDragonsWrathLongbowStirring)} />
						Has Dragon's Wrath Longbow (Stirring)?
					</Label>
				</div>
			</CardContent>
			<CardFooter>
				<GloomStalkerAttackSheet
					gloomStalkerInfo={gloomStalkerInfo}
					addToHistory={addToHistory}
				/>
			</CardFooter>
		</Card>
	);
}