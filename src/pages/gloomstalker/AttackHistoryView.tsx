import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HistoryRecord } from "./GloomStalkerTypes";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import AttackHistoryDetails from "./AttackHistoryDetails";

interface AttackHistoryViewProps {
	defaultOpen?: boolean;
	historyRecord: HistoryRecord;
}

export default function AttackHistoryView({ defaultOpen, historyRecord }: AttackHistoryViewProps) {
	const hitStatusText = historyRecord.isHit ? " Hit" : " Miss";
	const hitValueTextColorClass = historyRecord.isHit ? "text-green-500" : "text-red-500";

	return (
		<Collapsible defaultOpen={defaultOpen ?? false} className="group/collapsible">
			<CollapsibleTrigger asChild className="w-full">
				<Button variant="ghost">
					<h3>
						{new Date(historyRecord.timestamp).toLocaleString()} -
						<span className={hitValueTextColorClass}>{hitStatusText}</span>
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