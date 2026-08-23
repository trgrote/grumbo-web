import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export default class SetAdvantageCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private hasAdvantage: boolean) { super(); }

	protected applyToCharacterState(characterState: GloomStalkerAttackState): GloomStalkerAttackState {
		return {
			...characterState,
			hasAdvantage: this.hasAdvantage
		};
	}
}
