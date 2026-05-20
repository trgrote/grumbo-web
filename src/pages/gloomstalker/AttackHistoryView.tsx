import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HistoryRecord } from "./GloomStalkerTypes";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import AttackHistoryDetails from "./AttackHistoryDetails";
import { GetHitStatusColorClass, GetHitStatusText } from "./AttackSheet/AttackSheetStateFunctions";

interface AttackHistoryViewProps {
	defaultOpen?: boolean;
	historyRecord: HistoryRecord;
}

export default function AttackHistoryView({ defaultOpen, historyRecord }: AttackHistoryViewProps) {
	const hitText = GetHitStatusText(historyRecord);
	const hitTextColorClass = GetHitStatusColorClass(historyRecord);

	return (
		<Collapsible defaultOpen={defaultOpen ?? false} className="group/collapsible">
			<CollapsibleTrigger asChild className="w-full">
				<Button variant="ghost">
					<h3>
						<span className={hitTextColorClass}>{hitText}</span> - {new Date(historyRecord.timestamp).toLocaleString()}
					</h3>
					<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<AttackHistoryDetails historyRecord={historyRecord} />
			</CollapsibleContent>
		</Collapsible>
	);
}