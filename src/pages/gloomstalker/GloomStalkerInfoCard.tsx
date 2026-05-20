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
		damageModifier
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