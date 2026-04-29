import { GetLocalStorage, SaveLocalStorage } from "@/utils/LocalStorage";
import { PaladinLocalStorage } from "./PaladinTypes";

const storageKey = 'paladin-storage';
const storageVersion = '1.0';
const defaultItem = {
	paladinInfo: {
		attackModifier: 12,
		damageDie: 8,
		damageModifier: 9,
		hasImprovedDS: true
	},
	attackResults: []
};

export function GetLocalPaladinStorage(): PaladinLocalStorage {
	return GetLocalStorage<PaladinLocalStorage>(storageKey, storageVersion, defaultItem);
}

export function SaveLocalPaladinStorage(paladinLocalStorage: PaladinLocalStorage) {
	SaveLocalStorage<PaladinLocalStorage>(storageKey, storageVersion, paladinLocalStorage);
}