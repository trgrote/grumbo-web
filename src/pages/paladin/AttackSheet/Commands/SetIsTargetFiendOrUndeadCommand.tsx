import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { PaladinAttackState } from "../../PaladinTypes";

export default class SetIsTargetFiendOrUndeadCommand extends CharacterStateCommand<PaladinAttackState> {
	constructor(private isTargetFiendOrUndead: boolean) { super(); }

	protected applyToCharacterState(characterState: PaladinAttackState): PaladinAttackState {
		return {
			...characterState,
			isTargetFiendOrUndead: this.isTargetFiendOrUndead
		};
	}
}
