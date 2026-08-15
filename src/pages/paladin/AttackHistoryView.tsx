import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { HistoryRecord } from "./PaladinTypes";
import { GetHighestAttackValue, GetHitPreConfirmStatusColorClass, GetTotalDamage } from "./AttackSheet/AttackSheetStateFunctions";
import AttackHistoryDetails from "./AttackHistoryDetails";

interface AttackHistoryViewProps {
	defaultOpen?: boolean;
	historyRecord: HistoryRecord;
}

export default function AttackHistoryView({ defaultOpen, historyRecord }: AttackHistoryViewProps) {
	const highestAttackValue = GetHighestAttackValue(historyRecord);
	const totalDamage = GetTotalDamage(historyRecord);
	const hitValueTextColorClass = GetHitPreConfirmStatusColorClass(historyRecord);

	return (
		<Collapsible defaultOpen={defaultOpen ?? false} className="group/collapsible">
			<CollapsibleTrigger asChild className="w-full">
				<Button variant="ghost">
					<h3>
						To Hit: <span className={hitValueTextColorClass}>{highestAttackValue}</span>&nbsp;
						Damage: <span className="text-red-500">{totalDamage}</span>
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
