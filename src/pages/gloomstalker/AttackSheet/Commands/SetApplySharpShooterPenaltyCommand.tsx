import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export default class SetApplySharpShooterPenaltyCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private applySharpShooterPenalty: boolean) { super(); }

	protected applyToCharacter(character: GloomStalkerAttackState): GloomStalkerAttackState {
		return {
			...character,
			applySharpShooterPenalty: this.applySharpShooterPenalty
		};
	}
}
