import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export default class SetAdvantageCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private hasAdvantage: boolean) { super(); }

	protected applyToCharacter(character: GloomStalkerAttackState): GloomStalkerAttackState {
		return {
			...character,
			hasAdvantage: this.hasAdvantage
		};
	}
}
