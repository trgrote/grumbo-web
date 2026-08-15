import { GetLocalStorage, ILocalStorageItem, SaveLocalStorage } from "@/utils/LocalStorage";
import { HistoryRecord, PaladinInfo } from "./PaladinTypes";

const storageKey = 'paladin-storage';
const storageVersion = '1.1';
const defaultItem = {
	paladinInfo: {
		attackModifier: 12,
		damageDie: 8,
		damageModifier: 9,
		hasImprovedDS: true
	},
	attackResults: []
};

// Stored Local Data
export interface PaladinLocalStorage extends ILocalStorageItem {
	paladinInfo: PaladinInfo;
	attackResults: HistoryRecord[];
}

export function GetLocalPaladinStorage(): PaladinLocalStorage {
	return GetLocalStorage<PaladinLocalStorage>(storageKey, storageVersion, defaultItem);
}

export function SaveLocalPaladinStorage(paladinLocalStorage: PaladinLocalStorage) {
	SaveLocalStorage<PaladinLocalStorage>(storageKey, storageVersion, paladinLocalStorage);
}