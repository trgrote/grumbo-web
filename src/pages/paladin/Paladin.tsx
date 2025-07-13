import { useEffect, useState } from "react";
import PaladinHistoryTab from "./PaladinHistoryTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaladinInfoTab from "./PaladinInfoTab";
import { PaladinInfo, RollHistoryRecord } from "./PaladinTypes";
import { GetLocalStorage, SaveLocalStorage } from "./PaladinLocalStorage";

// TODO: Save History in local storage
// TODO: Add input validation to only allow integers for modifier fields
function Paladin() {
	const [paladinInfo, setPaladinInfo] = useState<PaladinInfo>(() => {
		const localStorage = GetLocalStorage();
		return localStorage.paladinInfo;
	});

	const [attackResults, setAttackResults] = useState<RollHistoryRecord[]>(() => {
		const localStorage = GetLocalStorage();
		return localStorage.attackResults;
	});

	// On State change, save results to local storage
	useEffect(() => {
		SaveLocalStorage({
			paladinInfo,
			attackResults
		});
	}, [paladinInfo, attackResults]);

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