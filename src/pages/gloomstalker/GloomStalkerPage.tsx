import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { GloomStalkerInfo } from "./GloomStalkerTypes";
import { GetLocalGloomStalkerStorage, SaveLocalGloomStalkerStorage } from "./GloomStalkerLocalStorage";

function GloomStalkerPage() {
	const [gloomStalkerInfo/*, setGloomStalkerInfo*/] = useState<GloomStalkerInfo>(() => {
		const localStorage = GetLocalGloomStalkerStorage();
		return localStorage.gloomStalkerInfo;
	});

	// const [attackResults, setAttackResults] = useState<RollHistoryRecord[]>(() => {
	// 	const localStorage = GetLocalGloomStalkerStorage();
	// 	return localStorage.attackResults;
	// });

	// On State change, save results to local storage
	useEffect(() => {
		SaveLocalGloomStalkerStorage({
			gloomStalkerInfo: gloomStalkerInfo,
			// attackResults
		});
	}, [gloomStalkerInfo/*, attackResults*/]);

	return (
		<Tabs defaultValue="info">
			<TabsList>
				<TabsTrigger value="info">Gloom Stalker Info</TabsTrigger>
				<TabsTrigger value="history">History</TabsTrigger>
			</TabsList>
			<TabsContent value="info">
				{/* <GloomStalkerInfoTab
					gloomStalkerInfo={gloomStalkerInfo}
					onChange={setGloomStalkerInfo}
					addToRollHistory={roll => setAttackResults([roll, ...attackResults])} /> */}
			</TabsContent>
			<TabsContent value="history">
				{/* <GloomStalkerHistoryTab attackResults={attackResults}
					rollRecordRenderer={(attackResult) => <RollResultView {...attackResult} />}
					onClearHistory={() => setAttackResults([])} /> */}
			</TabsContent>
		</Tabs>
	);
}

export default GloomStalkerPage;