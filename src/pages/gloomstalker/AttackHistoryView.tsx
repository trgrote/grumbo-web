import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HistoryRecord } from "./GloomStalkerTypes";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { GetHitRollStatus, GetHitRollStatusColorClass } from "./AttackSheet/AttackSheetStateFunctions";
import AttackHistoryDetails from "./AttackHistoryDetails";

interface AttackHistoryViewProps {
	defaultOpen?: boolean;
	historyRecord: HistoryRecord;
}

export default function AttackHistoryView({ defaultOpen, historyRecord }: AttackHistoryViewProps) {
	const { gloomStalkerInfo } = historyRecord;

	const highestHitRoll = Math.max(...historyRecord.attackRolls);
	const hitStatus = GetHitRollStatus(historyRecord.attackRolls);
	const totalHitRoll = highestHitRoll
		+ gloomStalkerInfo.attackModifier
		- (historyRecord.applySharpShooterPenalty ? 5 : 0);
	const totalPiercingDamage = historyRecord.piercingDamageRolls.reduce((a, value) => a + value, 0)
		+ gloomStalkerInfo.damageModifier
		+ (historyRecord.applySharpShooterPenalty ? 10 : 0);
	const totalFireDamage = historyRecord.fireDamageRolls.reduce((a, value) => a + value, 0);
	const totalDamage = totalPiercingDamage + totalFireDamage;
	const hitValueTextColorClass = GetHitRollStatusColorClass(hitStatus);

	return (
		<Collapsible defaultOpen={defaultOpen ?? false} className="group/collapsible">
			<CollapsibleTrigger asChild className="w-full">
				<Button variant="ghost">
					<h3>
						{new Date(historyRecord.timestamp).toLocaleString()} -
						To Hit: <span className={hitValueTextColorClass}>{totalHitRoll}</span>&nbsp;
						Damage: <span className="text-red-500">{historyRecord.isHit ? totalDamage : 0}</span>
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