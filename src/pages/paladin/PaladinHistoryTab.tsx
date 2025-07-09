import { RollResult } from "./Functions";
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

export interface PaladinHistoryProps {
	attackResults: RollResult[];
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
				<div style={{ height: 120, overflowY: 'auto' }}>
					{
						attackResults.map((attackResult, i) => <RollResultView key={i} {...attackResult} />)
					}
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={onClearHistory}>Clear Rolls</Button>
			</CardFooter>
		</Card>
	);
}