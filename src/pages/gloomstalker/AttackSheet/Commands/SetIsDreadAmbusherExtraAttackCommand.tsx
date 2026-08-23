import CharacterStateCommand from "@/attackSheet/Commands/CharacterStateCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export default class SetIsDreadAmbusherExtraAttackCommand extends CharacterStateCommand<GloomStalkerAttackState> {
	constructor(private isDreadAmbusherExtraAttack: boolean) { super(); }

	protected applyToCharacter(character: GloomStalkerAttackState): GloomStalkerAttackState {
		return {
			...character,
			isDreadAmbusherExtraAttack: this.isDreadAmbusherExtraAttack
		};
	}
}
