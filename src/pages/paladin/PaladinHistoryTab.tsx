import * as React from "react";
import { Button } from "@/components/ui/button";
import RollResultView from "./RollResultView";
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
import { RollHistoryRecord } from "./PaladinTypes";

export interface PaladinHistoryProps {
	attackResults: RollHistoryRecord[];
	onClearHistory: () => void;
}

export default function PaladinHistoryTab({ attackResults, onClearHistory }: PaladinHistoryProps) {
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
							attackResults.map((attackResult, i) =>
								<React.Fragment key={i}>
									<RollResultView {...attackResult} />
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