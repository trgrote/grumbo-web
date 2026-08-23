import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export default class SetApplySharpShooterPenaltyCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private applySharpShooterPenalty: boolean) { super(); }

	protected applyToCharacterState(characterState: GloomStalkerAttackState): GloomStalkerAttackState {
		return {
			...characterState,
			applySharpShooterPenalty: this.applySharpShooterPenalty
		};
	}
}
