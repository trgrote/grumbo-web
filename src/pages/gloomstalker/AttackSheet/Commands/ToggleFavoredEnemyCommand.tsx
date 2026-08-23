import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export default class ToggleFavoredEnemyCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private name: string) { super(); }

	protected applyToCharacterState(characterState: GloomStalkerAttackState): GloomStalkerAttackState {
		const isSelected = characterState.selectedFavoredEnemies.includes(this.name);
		return {
			...characterState,
			selectedFavoredEnemies: isSelected
				? characterState.selectedFavoredEnemies.filter(name => name !== this.name)
				: [...characterState.selectedFavoredEnemies, this.name]
		};
	}
}
