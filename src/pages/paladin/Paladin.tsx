import { useState } from "react";
import PaladinHistoryTab from "./PaladinHistoryTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaladinInfoTab from "./PaladinInfoTab";
import { PaladinInfo, RollHistoryRecord } from "./PaladinTypes";

// TODO
// - Save History in local storage
// - Maybe make the 'config' part a form
// - Update logic to allow spell slots to be selected after attack roll.
// - Add input validation to only allow integers for modifier fields
// - Space Fields better

/**
 * 
 * When you hit with a melee weapon attack, you can expend one spell slot to deal 2d8 extra radiant damage to the target plus 1d8 for each spell level higher than 1st (max 5d8) and plus 1d8 against undead or fiends.
 */

function Paladin() {
	const [paladinInfo, setPaladinInfo] = useState<PaladinInfo>({
		attackModifier: 12,
		damageDie: 8,
		damageModifier: 9,
		hasImprovedDS: true
	});

	const [attackResults, setAttackResults] = useState<RollHistoryRecord[]>([]);

	return (
		<Tabs defaultValue="paladinInfo">
			<TabsList>
				<TabsTrigger value="paladinInfo">Paladin Info</TabsTrigger>
				<TabsTrigger value="history">History</TabsTrigger>
			</TabsList>
			<TabsContent value="paladinInfo">
				<PaladinInfoTab paladinInfo={paladinInfo} onChange={setPaladinInfo} addToRollHistory={roll => setAttackResults([roll, ...attackResults])} />
			</TabsContent>
			<TabsContent value="history">
				<PaladinHistoryTab attackResults={attackResults}
					onClearHistory={() => setAttackResults([])} />
			</TabsContent>
		</Tabs>
	);
}

export default Paladin;