interface RollResultProps {
	attackRolls: number[];
	isCritical: boolean;
	weaponDamageRolls: number[];
	divineSmiteDamageRolls: number[];
}

const RollResultView: React.FC<RollResultProps> = (props: RollResultProps) => {
	const { attackRolls, isCritical, weaponDamageRolls, divineSmiteDamageRolls } = props;

	const maxAttackRoll = Math.max(...attackRolls);

	const totalDamage = [...weaponDamageRolls, ...divineSmiteDamageRolls]
		.reduce((a, value) => a + value, 0);

	const attackRollElement = isCritical ?
		<strong>{maxAttackRoll}</strong> :
		<>{maxAttackRoll}</>;

	return (
		<>
			<div>
				<label>Attack Roll:</label> {attackRollElement}
			</div>
			<div>
				<label>Total Damage:</label> {totalDamage}
			</div>
		</>
	);
};

export default RollResultView;