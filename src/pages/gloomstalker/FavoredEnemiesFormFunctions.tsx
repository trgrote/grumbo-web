export interface AddFavoredEnemyResult {
	favoredEnemies: string[];
	added: boolean;
}

export function AddFavoredEnemy(favoredEnemies: string[], name: string): AddFavoredEnemyResult {
	const trimmedName = name.trim();
	if (trimmedName === '' || favoredEnemies.includes(trimmedName)) {
		return { favoredEnemies, added: false };
	}

	// Dedupe defensively: a stale closure could otherwise let two rapid adds insert the same name twice,
	// which would collide as a React key/id on the badge list below.
	return { favoredEnemies: Array.from(new Set([...favoredEnemies, trimmedName])), added: true };
}

export function RemoveFavoredEnemy(favoredEnemies: string[], name: string): string[] {
	return favoredEnemies.filter(favoredEnemy => favoredEnemy !== name);
}
