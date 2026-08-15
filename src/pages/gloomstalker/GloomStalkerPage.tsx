import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { GloomStalkerInfo, HistoryRecord } from "./GloomStalkerTypes";
import { GetLocalGloomStalkerStorage, SaveLocalGloomStalkerStorage } from "./GloomStalkerLocalStorage";
import GloomStalkerInfoCard from "./GloomStalkerInfoCard";
import AttackHistoryView from "./AttackHistoryView";
import HistoryTab from "@/components/HistoryTab";

function GloomStalkerPage() {
	const [localStorageData] = useState(() => GetLocalGloomStalkerStorage());

	const [gloomStalkerInfo, setGloomStalkerInfo] = useState<GloomStalkerInfo>(localStorageData.gloomStalkerInfo);

	const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(localStorageData.historyRecords);

	// On State change, save results to local storage
	useEffect(() => {
		SaveLocalGloomStalkerStorage({
			gloomStalkerInfo: gloomStalkerInfo,
			historyRecords: historyRecords
		});
	}, [gloomStalkerInfo, historyRecords]);

	return (
		<Tabs defaultValue="info">
			<TabsList>
				<TabsTrigger value="info">Gloom Stalker Info</TabsTrigger>
				<TabsTrigger value="history">History</TabsTrigger>
			</TabsList>
			<TabsContent value="info">
				<GloomStalkerInfoCard
					gloomStalkerInfo={gloomStalkerInfo}
					onChange={setGloomStalkerInfo}
					addToHistory={historyRecord => setHistoryRecords([historyRecord, ...historyRecords])}
				/>
			</TabsContent>
			<TabsContent value="history">
				<HistoryTab<HistoryRecord> records={historyRecords}
					rollRecordRenderer={(historyRecord) => <AttackHistoryView historyRecord={historyRecord} />}
					onClearHistory={() => setHistoryRecords([])} />
			</TabsContent>
		</Tabs>
	);
}

export default GloomStalkerPage;