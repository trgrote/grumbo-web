import { useState } from "react";
import PaladinHistoryTab from "./PaladinHistoryTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaladinInfoTab from "./PaladinInfoTab";
import { PaladinInfo, RollHistoryRecord } from "./PaladinTypes";

// TODO: Save History in local storage
// TODO: Add input validation to only allow integers for modifier fields
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