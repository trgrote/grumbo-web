import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class ToggleFavoredEnemyCommand implements IGSAttackSheetCommand {
	constructor(private name: string) { }
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		const isSelected = prevState.selectedFavoredEnemies.includes(this.name);
		return {
			...prevState,
			selectedFavoredEnemies: isSelected
				? prevState.selectedFavoredEnemies.filter(name => name !== this.name)
				: [...prevState.selectedFavoredEnemies, this.name]
		};
	}
}
