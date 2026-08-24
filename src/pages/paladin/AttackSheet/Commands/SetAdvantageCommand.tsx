import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { PaladinAttackState } from "../../PaladinTypes";

export default class SetAdvantageCommand extends CharacterStateCommand<PaladinAttackState> {
	constructor(private hasAdvantage: boolean) { super(); }

	protected applyToCharacterState(characterState: PaladinAttackState): PaladinAttackState {
		return {
			...characterState,
			hasAdvantage: this.hasAdvantage
		};
	}
}
