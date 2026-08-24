import { Button } from "@/components/ui/button";
import { Dispatch } from "react";
import { IAttackSheetCommand } from "../AttackSheetTypes";
import GoBackCommand from "../Commands/GoBackCommand";

export interface GoBackButtonProps<TCharacterState> {
	dispatch: Dispatch<IAttackSheetCommand<TCharacterState>>;
}

// Stepping backwards is a shared-flow action, so the button owns the dispatch rather than
// making every step wire up its own identical handler.
export default function GoBackButton<TCharacterState>({ dispatch }: GoBackButtonProps<TCharacterState>) {
	return (
		<Button variant="outline" onClick={() => dispatch(new GoBackCommand<TCharacterState>())}>
			Back
		</Button>
	);
}
