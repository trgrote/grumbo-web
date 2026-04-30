import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { HistoryRecord } from "./GloomStalkerTypes";

export interface GloomStalkerHistoryProps {
	historyRecords: HistoryRecord[];
	onClearHistory: () => void;
	rollRecordRenderer: (record: HistoryRecord) => React.JSX.Element;
}

export default function GloomStalkerHistoryTab({ historyRecords, onClearHistory, rollRecordRenderer }: GloomStalkerHistoryProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Roll History</CardTitle>
				<CardDescription>View and Clear Roll History</CardDescription>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-120 rounded-md border">
					<div className="p-4">
						{
							historyRecords.map((historyRecord, i) =>
								<React.Fragment key={i}>
									{rollRecordRenderer(historyRecord)}
									<Separator className="my-2" />
								</React.Fragment>
							)
						}
					</div>
				</ScrollArea>
			</CardContent>
			<CardFooter>
				<Button onClick={onClearHistory}>Clear Rolls</Button>
			</CardFooter>
		</Card>
	);
}