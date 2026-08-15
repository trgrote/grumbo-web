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

export interface HistoryTabProps<T extends { timestamp: number }> {
	records: T[];
	onClearHistory: () => void;
	rollRecordRenderer: (record: T) => React.JSX.Element;
}

export default function HistoryTab<T extends { timestamp: number }>({ records, onClearHistory, rollRecordRenderer }: HistoryTabProps<T>) {
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
							records.map((record) =>
								<React.Fragment key={record.timestamp}>
									{rollRecordRenderer(record)}
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
