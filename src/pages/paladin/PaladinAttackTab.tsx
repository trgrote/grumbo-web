import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Roll } from "./PaladinFunctions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useState } from "react";
import { PaladinInfo, RollResult } from "./PaladinTypes";

export interface PaladinAttackTabProps {
	paladinInfo: PaladinInfo;
	addToRollHistory: (result: RollResult) => void;
}

export default function PaladinAttackTab({ paladinInfo, addToRollHistory }: PaladinAttackTabProps) {
	const [hasAdvantage, setHasAdvantage] = useState(false);

	const [isTargetFiendOrUndead, setIsTargetFiendOrUndead] = useState(false);
	const [spellSlotUsed, setSpellSlotUsed] = useState(0);

	const onRollClick = () => {
		const roll = Roll({
			...paladinInfo,
			hasAdvantage,
			spellSlotUsed
		});

		addToRollHistory(roll);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Attack Info</CardTitle>
				<CardDescription>Set Attack Info</CardDescription>
			</CardHeader>
			<CardContent>
				<div>
					<label>
						<Checkbox name="hasAdvantage" checked={hasAdvantage}
							onCheckedChange={() => setHasAdvantage(!hasAdvantage)} />
						Has Advantage?
					</label>
				</div>
				<div title="Adds 1d8 Radiant Damage on any attack against undead or fiends">
					<label>
						<Checkbox name="isTargetFiendOrUndead" checked={isTargetFiendOrUndead}
							onCheckedChange={() => setIsTargetFiendOrUndead(!isTargetFiendOrUndead)} />
						Is Target Fiend or Undead?
					</label>
				</div>
				<div>
					<label>
						Spell Slot Used?
					</label>
					<ToggleGroup type="single"
						value={spellSlotUsed.toString()}
						onValueChange={newValue => setSpellSlotUsed(parseInt(newValue))}>
						<ToggleGroupItem value='0'><div className="w-12">None</div></ToggleGroupItem>
						<ToggleGroupItem value='1'><div className="w-12">1</div></ToggleGroupItem>
						<ToggleGroupItem value='2'><div className="w-12">2</div></ToggleGroupItem>
						<ToggleGroupItem value='3'><div className="w-12">3</div></ToggleGroupItem>
						<ToggleGroupItem value='4'><div className="w-12">4+</div></ToggleGroupItem>
					</ToggleGroup>
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={onRollClick}>Roll</Button>
			</CardFooter>
		</Card>
	);
}