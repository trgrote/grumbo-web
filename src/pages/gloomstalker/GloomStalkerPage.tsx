import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { GloomStalkerInfo, HistoryRecord } from "./GloomStalkerTypes";
import { GetLocalGloomStalkerStorage, SaveLocalGloomStalkerStorage } from "./GloomStalkerLocalStorage";
import GloomStalkerInfoCard from "./GloomStalkerInfoCard";
import AttackHistoryView from "./AttackHistoryView";
import GloomStalkerHistoryTab from "./GloomStalkerHistoryTab";

function GloomStalkerPage() {
	const [gloomStalkerInfo, setGloomStalkerInfo] = useState<GloomStalkerInfo>(() => {
		const localStorage = GetLocalGloomStalkerStorage();
		return localStorage.gloomStalkerInfo;
	});

	const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(() => {
		const localStorage = GetLocalGloomStalkerStorage();
		return localStorage.historyRecords;
	});

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
				<GloomStalkerHistoryTab historyRecords={historyRecords}
					rollRecordRenderer={(historyRecord) => <AttackHistoryView historyRecord={historyRecord} />}
					onClearHistory={() => setHistoryRecords([])} />
			</TabsContent>
		</Tabs>
	);
}

export default GloomStalkerPage;