import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JSX, useState } from "react";
import { GloomStalkerInfo } from "./GloomStalkerTypes";

enum AttackState {
	PreHitRoll,
	PostHitRoll,
	PreDamageRoll,
	PostDamageRoll
}

export interface GloomStalkerAttackSheetProps {
	gloomStalkerInfo: GloomStalkerInfo;
}

export default function GloomStalkerAttackSheet({ gloomStalkerInfo }: GloomStalkerAttackSheetProps) {
	const [attackState, setAttackState] = useState<AttackState>(AttackState.PreHitRoll);

	const resetSheet = (): void => {
		setAttackState(AttackState.PreHitRoll);
	};

	const renderSheetContent = (): JSX.Element => {
		return (
			<>
				{attackState === AttackState.PreHitRoll && <div>Pre Hit Roll State</div>}
				{attackState === AttackState.PostHitRoll && <div>Post Hit Roll State</div>}
				{attackState === AttackState.PreDamageRoll && <div>Pre Damage Roll State</div>}
				{attackState === AttackState.PostDamageRoll && <div>Post Damage Roll State</div>}
			</>
		);
	};

	return (
		<Sheet onOpenChange={(open) => { if (!open) resetSheet(); }}>
			<SheetTrigger asChild>
				<Button>Roll for Attack</Button>
			</SheetTrigger>
			<SheetContent className="dark bg-background text-neutral-300">
				{renderSheetContent()}
			</SheetContent>
		</Sheet>
	);
}