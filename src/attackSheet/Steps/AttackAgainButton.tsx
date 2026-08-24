import { Button } from "@/components/ui/button";
import { Dispatch } from "react";
import { IAttackSheetCommand } from "../AttackSheetTypes";
import AttackAgainCommand from "../Commands/AttackAgainCommand";

export interface AttackAgainButtonProps<TCharacterState> {
	dispatch: Dispatch<IAttackSheetCommand<TCharacterState>>;
}

// Starting a fresh attack from the results screen - shared, like GoBackButton.
export default function AttackAgainButton<TCharacterState>({ dispatch }: AttackAgainButtonProps<TCharacterState>) {
	return (
		<Button onClick={() => dispatch(new AttackAgainCommand<TCharacterState>())} type="submit">
			Attack Again
		</Button>
	);
}
