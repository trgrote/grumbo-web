import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FavoredEnemiesFormProps {
	favoredEnemies: string[];
	onChange: (favoredEnemies: string[]) => void;
}

export default function FavoredEnemiesForm({ favoredEnemies, onChange }: FavoredEnemiesFormProps) {
	const [newFavoredEnemy, setNewFavoredEnemy] = useState('');

	const addFavoredEnemy = () => {
		const trimmedName = newFavoredEnemy.trim();
		if (trimmedName === '' || favoredEnemies.includes(trimmedName)) return;

		onChange(Array.from(new Set([...favoredEnemies, trimmedName])));
		setNewFavoredEnemy('');
	};

	const removeFavoredEnemy = (name: string) => {
		onChange(favoredEnemies.filter(favoredEnemy => favoredEnemy !== name));
	};

	return (
		<div>
			<Label>Favored Enemies</Label>
			<ul>
				{favoredEnemies.map(name => (
					<li key={name}>
						{name}
						<Button variant="outline" onClick={() => removeFavoredEnemy(name)}>Remove</Button>
					</li>
				))}
			</ul>
			<Input
				type="text"
				value={newFavoredEnemy}
				placeholder="Enemy type (e.g. Giant)"
				onChange={e => setNewFavoredEnemy(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						e.preventDefault();
						addFavoredEnemy();
					}
				}}
			/>
			<Button onClick={addFavoredEnemy}>Add</Button>
		</div>
	);
}
