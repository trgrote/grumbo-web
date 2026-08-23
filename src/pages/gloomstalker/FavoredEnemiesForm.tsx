import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddFavoredEnemy, RemoveFavoredEnemy } from "./FavoredEnemiesFormFunctions";

export interface FavoredEnemiesFormProps {
	favoredEnemies: string[];
	onChange: (favoredEnemies: string[]) => void;
}

export default function FavoredEnemiesForm({ favoredEnemies, onChange }: FavoredEnemiesFormProps) {
	const [newFavoredEnemy, setNewFavoredEnemy] = useState('');

	const addFavoredEnemy = () => {
		const result = AddFavoredEnemy(favoredEnemies, newFavoredEnemy);
		if (result.added) {
			onChange(result.favoredEnemies);
			setNewFavoredEnemy('');
		}
	};

	const removeFavoredEnemy = (name: string) => {
		onChange(RemoveFavoredEnemy(favoredEnemies, name));
	};

	return (
		<div className="flex flex-col gap-2 mt-4">
			<label>Favored Enemies</label>
			<ul className="flex flex-wrap gap-2">
				{favoredEnemies.map(name => (
					<li key={name}>
						<Badge variant="secondary">
							{name}
							<button type="button" aria-label={`Remove ${name}`} onClick={() => removeFavoredEnemy(name)}>
								<X className="size-3 cursor-pointer" />
							</button>
						</Badge>
					</li>
				))}
			</ul>
			<div className="flex gap-2">
				<Input
					type="text"
					className="flex-1"
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
		</div>
	);
}
