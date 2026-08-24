import ResetCommand from "./ResetCommand";

// Currently identical to ResetCommand, but kept distinct because the intents differ:
// this is the user starting a new attack from the results screen, where Reset is the
// sheet being torn down. Keeping the names separate means one can change without the other.
export default class AttackAgainCommand<TCharacterState> extends ResetCommand<TCharacterState> { }
