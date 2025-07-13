import { PaladinLocalStorage } from "./PaladinTypes";

const storageKey = 'paladin-storage';
const storageVersion = '1.0';

// Get Local Storage or Default
export function GetLocalStorage(): PaladinLocalStorage {
	const savedStorageStr = localStorage.getItem(storageKey);

	// if we found a value
	if (savedStorageStr) {
		const savedStorage = JSON.parse(savedStorageStr);

		// and if the storage matches the schema version we expect
		if (savedStorage.storageVersion === storageVersion) {
			return savedStorage;
		}
	}

	// return default
	return {
		storageVersion,
		paladinInfo: {
			attackModifier: 12,
			damageDie: 8,
			damageModifier: 9,
			hasImprovedDS: true
		},
		attackResults: []
	};
}

export function SaveLocalStorage(paladinLocalStorage: PaladinLocalStorage) {
	paladinLocalStorage.storageVersion = storageVersion;
	localStorage.setItem(storageKey, JSON.stringify(paladinLocalStorage));
}