import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { PaladinAttackState } from "../../PaladinTypes";

export default class SetSpellSlotUsedCommand extends CharacterStateCommand<PaladinAttackState> {
	constructor(private spellSlotUsed: number) { super(); }

	protected applyToCharacterState(characterState: PaladinAttackState): PaladinAttackState {
		return {
			...characterState,
			spellSlotUsed: this.spellSlotUsed
		};
	}
}
