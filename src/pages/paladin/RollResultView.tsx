interface RollResultProps {
	attackRolls: number[];
	isCritical: boolean;
	weaponDamageRolls: number[];
	divineSmiteDamageRolls: number[];
}

const rollArrayToString = (arr: number[]) => '[' + arr.join(', ') + ']';

const RollResultView: React.FC<RollResultProps> = (props: RollResultProps) => {
	const { attackRolls, isCritical, weaponDamageRolls, divineSmiteDamageRolls } = props;

	const maxAttackRoll = Math.max(...attackRolls);

	const totalDamage = [...weaponDamageRolls, ...divineSmiteDamageRolls]
		.reduce((a, value) => a + value, 0);

	const attackRollElement = isCritical ?
		<strong>{maxAttackRoll}</strong> :
		<>{maxAttackRoll}</>;

	const attackHoverText = (isCritical ? "CRIT!\n" : "") +
		rollArrayToString(attackRolls);

	const totalDamageHoverText = "Weapon: " + '[' + weaponDamageRolls.join(', ') + ']' + (
		divineSmiteDamageRolls.length > 0 ?
			"\nDivine Smite: " + rollArrayToString(divineSmiteDamageRolls) :
			''
	);

	return (
		<div style={{ borderRadius: 8, borderWidth: 5, backgroundColor: 'Menu' }}>
			<div title={attackHoverText}>
				<label>To Hit:</label> {attackRollElement}
			</div>
			<div title={totalDamageHoverText}>
				<label>Damage:</label> {totalDamage}
			</div>
		</div>
	);
};

export default RollResultView;