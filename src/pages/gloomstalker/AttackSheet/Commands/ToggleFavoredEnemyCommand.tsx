import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export default class ToggleFavoredEnemyCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private name: string) { super(); }

	protected applyToCharacter(character: GloomStalkerAttackState): GloomStalkerAttackState {
		const isSelected = character.selectedFavoredEnemies.includes(this.name);
		return {
			...character,
			selectedFavoredEnemies: isSelected
				? character.selectedFavoredEnemies.filter(name => name !== this.name)
				: [...character.selectedFavoredEnemies, this.name]
		};
	}
}
