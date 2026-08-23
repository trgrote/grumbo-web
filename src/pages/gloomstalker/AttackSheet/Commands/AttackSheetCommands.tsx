import { IAttackSheetCommand } from "@/attackSheet/AttackSheetTypes";
import SharedAttackAgainCommand from "@/attackSheet/Commands/AttackAgainCommand";
import SharedConfirmDamageCommand from "@/attackSheet/Commands/ConfirmDamageCommand";
import SharedConfirmIsHitCommand from "@/attackSheet/Commands/ConfirmIsHitCommand";
import SharedConfirmIsMissCommand from "@/attackSheet/Commands/ConfirmIsMissCommand";
import SharedGoBackCommand from "@/attackSheet/Commands/GoBackCommand";
import SharedNullCommand from "@/attackSheet/Commands/NullCommand";
import SharedResetCommand from "@/attackSheet/Commands/ResetCommand";
import SharedRollForAttackCommand from "@/attackSheet/Commands/RollForAttackCommand";
import SharedRollForDamageCommand from "@/attackSheet/Commands/RollForDamageCommand";
import { GloomStalkerAttackState } from "../../GloomStalkerTypes";

export type IGSAttackSheetCommand = IAttackSheetCommand<GloomStalkerAttackState>;

// Flow commands, shared with every other character's attack sheet, bound here to the
// Gloom Stalker's state so callers can keep writing `new GoBackCommand()`.
export const AttackAgainCommand = SharedAttackAgainCommand<GloomStalkerAttackState>;
export const ConfirmDamageCommand = SharedConfirmDamageCommand<GloomStalkerAttackState>;
export const ConfirmIsHitCommand = SharedConfirmIsHitCommand<GloomStalkerAttackState>;
export const ConfirmIsMissCommand = SharedConfirmIsMissCommand<GloomStalkerAttackState>;
export const GoBackCommand = SharedGoBackCommand<GloomStalkerAttackState>;
export const NullCommand = SharedNullCommand<GloomStalkerAttackState>;
export const ResetCommand = SharedResetCommand<GloomStalkerAttackState>;
export const RollForAttackCommand = SharedRollForAttackCommand<GloomStalkerAttackState>;
export const RollForDamageCommand = SharedRollForDamageCommand<GloomStalkerAttackState>;

// Gloom Stalker rules, applied to the Gloom Stalker's own state slice.
export { default as RerollWorstDamageDieCommand } from "./RerollWorstDamageDieCommand";
export { default as SetAdvantageCommand } from "./SetAdvantageCommand";
export { default as SetApplyHuntersMarkCommand } from "./SetApplyHuntersMarkCommand";
export { default as SetApplySharpShooterPenaltyCommand } from "./SetApplySharpShooterPenaltyCommand";
export { default as SetIsDreadAmbusherExtraAttackCommand } from "./SetIsDreadAmbusherExtraAttackCommand";
export { default as ToggleFavoredEnemyCommand } from "./ToggleFavoredEnemyCommand";
