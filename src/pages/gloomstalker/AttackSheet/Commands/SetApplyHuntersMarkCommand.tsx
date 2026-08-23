import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export default class SetApplyHuntersMarkCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private applyHuntersMark: boolean) { super(); }

	protected applyToCharacter(character: GloomStalkerAttackState): GloomStalkerAttackState {
		return {
			...character,
			applyHuntersMark: this.applyHuntersMark
		};
	}
}
