import { useEffect, useState } from "react";
import HistoryTab from "@/components/HistoryTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaladinInfoTab from "./PaladinInfoTab";
import { HistoryRecord, PaladinInfo } from "./PaladinTypes";
import { GetLocalPaladinStorage, SaveLocalPaladinStorage } from "./PaladinLocalStorage";
import AttackHistoryView from "./AttackHistoryView";

function PaladinPage() {
	const [localStorageData] = useState(() => GetLocalPaladinStorage());

	const [paladinInfo, setPaladinInfo] = useState<PaladinInfo>(localStorageData.paladinInfo);

	const [attackResults, setAttackResults] = useState<HistoryRecord[]>(localStorageData.attackResults);

	// On State change, save results to local storage
	useEffect(() => {
		SaveLocalPaladinStorage({
			paladinInfo,
			attackResults
		});
	}, [paladinInfo, attackResults]);

	return (
		<Tabs defaultValue="info">
			<TabsList>
				<TabsTrigger value="info">Paladin Info</TabsTrigger>
				<TabsTrigger value="history">History</TabsTrigger>
			</TabsList>
			<TabsContent value="info">
				<PaladinInfoTab
					paladinInfo={paladinInfo}
					onChange={setPaladinInfo}
					addToRollHistory={roll => setAttackResults([roll, ...attackResults])} />
			</TabsContent>
			<TabsContent value="history">
				<HistoryTab<HistoryRecord> records={attackResults}
					rollRecordRenderer={(historyRecord) => <AttackHistoryView historyRecord={historyRecord} />}
					onClearHistory={() => setAttackResults([])} />
			</TabsContent>
		</Tabs>
	);
}

export default PaladinPage;