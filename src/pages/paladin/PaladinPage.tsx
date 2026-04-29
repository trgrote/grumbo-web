import { useEffect, useState } from "react";
import PaladinHistoryTab from "./PaladinHistoryTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaladinInfoTab from "./PaladinInfoTab";
import { PaladinInfo, RollHistoryRecord } from "./PaladinTypes";
import { GetLocalPaladinStorage, SaveLocalPaladinStorage } from "./PaladinLocalStorage";
import RollResultView from "./RollResultView";

function PaladinPage() {
	const [paladinInfo, setPaladinInfo] = useState<PaladinInfo>(() => {
		const localStorage = GetLocalPaladinStorage();
		return localStorage.paladinInfo;
	});

	const [attackResults, setAttackResults] = useState<RollHistoryRecord[]>(() => {
		const localStorage = GetLocalPaladinStorage();
		return localStorage.attackResults;
	});

	// On State change, save results to local storage
	useEffect(() => {
		SaveLocalPaladinStorage({
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
				<PaladinInfoTab
					paladinInfo={paladinInfo}
					onChange={setPaladinInfo}
					addToRollHistory={roll => setAttackResults([roll, ...attackResults])} />
			</TabsContent>
			<TabsContent value="history">
				<PaladinHistoryTab attackResults={attackResults}
					rollRecordRenderer={(attackResult) => <RollResultView {...attackResult} />}
					onClearHistory={() => setAttackResults([])} />
			</TabsContent>
		</Tabs>
	);
}

export default PaladinPage;