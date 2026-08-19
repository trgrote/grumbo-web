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
import WeaponStatsForm from "@/components/WeaponStatsForm";
import FavoredEnemiesForm from "./FavoredEnemiesForm";

export interface GloomStalkerInfoCardProps {
	gloomStalkerInfo: GloomStalkerInfo;
	onChange: (gloomStalkerInfo: GloomStalkerInfo) => void;
	addToHistory: (historyRecord: HistoryRecord) => void;
}

export default function GloomStalkerInfoCard({ gloomStalkerInfo, onChange, addToHistory }: GloomStalkerInfoCardProps) {
	const {
		attackModifier,
		damageDie,
		damageModifier,
		favoredEnemies
	} = gloomStalkerInfo;

	return (
		<Card>
			<CardHeader>
				<CardTitle>GloomStalker Info</CardTitle>
				<CardDescription>Set GloomStalker Info</CardDescription>
			</CardHeader>
			<CardContent>
				<WeaponStatsForm
					attackModifier={attackModifier}
					damageDie={damageDie}
					damageModifier={damageModifier}
					onAttackModifierChange={(newValue) =>
						onChange({
							...gloomStalkerInfo,
							attackModifier: newValue
						})
					}
					onDamageDieChange={(newValue) =>
						onChange({
							...gloomStalkerInfo,
							damageDie: newValue
						})
					}
					onDamageModifierChange={(newValue) =>
						onChange({
							...gloomStalkerInfo,
							damageModifier: newValue
						})
					}
				/>
				<FavoredEnemiesForm
					favoredEnemies={favoredEnemies}
					onChange={(newFavoredEnemies) =>
						onChange({
							...gloomStalkerInfo,
							favoredEnemies: newFavoredEnemies
						})
					}
				/>
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