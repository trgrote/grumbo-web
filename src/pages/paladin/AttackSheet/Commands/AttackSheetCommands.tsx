import { IAttackSheetCommand } from "@/attackSheet/AttackSheetTypes";
import {
	AttackAgainCommand as SharedAttackAgainCommand,
	ConfirmIsHitCommand as SharedConfirmIsHitCommand,
	ConfirmIsMissCommand as SharedConfirmIsMissCommand,
	GoBackCommand as SharedGoBackCommand,
	NullCommand as SharedNullCommand,
	ResetCommand as SharedResetCommand,
	RollForAttackCommand as SharedRollForAttackCommand,
	RollForDamageCommand as SharedRollForDamageCommand
} from "@/attackSheet/Commands/AttackSheetCommands";
import { PaladinAttackState } from "../../PaladinTypes";

export type IPalAttackSheetCommand = IAttackSheetCommand<PaladinAttackState>;

// Flow commands, shared with every other character's attack sheet, bound here to the
// Paladin's state so callers can keep writing `new GoBackCommand()`.
// Note: ConfirmDamageCommand is deliberately not bound - the Paladin's flow has no
// PostDamageRoll step for it to advance out of.
export const AttackAgainCommand = SharedAttackAgainCommand<PaladinAttackState>;
export const ConfirmIsHitCommand = SharedConfirmIsHitCommand<PaladinAttackState>;
export const ConfirmIsMissCommand = SharedConfirmIsMissCommand<PaladinAttackState>;
export const GoBackCommand = SharedGoBackCommand<PaladinAttackState>;
export const NullCommand = SharedNullCommand<PaladinAttackState>;
export const ResetCommand = SharedResetCommand<PaladinAttackState>;
export const RollForAttackCommand = SharedRollForAttackCommand<PaladinAttackState>;
export const RollForDamageCommand = SharedRollForDamageCommand<PaladinAttackState>;

// Paladin rules, applied to the Paladin's own state slice.
export { default as SetAdvantageCommand } from "./SetAdvantageCommand";
export { default as SetIsTargetFiendOrUndeadCommand } from "./SetIsTargetFiendOrUndeadCommand";
export { default as SetSpellSlotUsedCommand } from "./SetSpellSlotUsedCommand";
