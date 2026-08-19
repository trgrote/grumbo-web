import { GetLocalStorage, ILocalStorageItem, SaveLocalStorage } from "@/utils/LocalStorage";
import { GloomStalkerInfo, HistoryRecord } from "./GloomStalkerTypes";

const storageKey = 'gloomstalker-storage';
const storageVersion = '0.3';
const defaultItem = {
	gloomStalkerInfo: {
		attackModifier: 14,
		damageDie: 8,
		damageModifier: 9,
		favoredEnemies: [],
	},
	historyRecords: []
};

export interface GloomStalkerLocalStorage extends ILocalStorageItem {
	gloomStalkerInfo: GloomStalkerInfo;
	historyRecords: HistoryRecord[];
}

export function GetLocalGloomStalkerStorage(): GloomStalkerLocalStorage {
	return GetLocalStorage<GloomStalkerLocalStorage>(storageKey, storageVersion, defaultItem);
}

export function SaveLocalGloomStalkerStorage(gloomStalkerLocalStorage: GloomStalkerLocalStorage) {
	SaveLocalStorage<GloomStalkerLocalStorage>(storageKey, storageVersion, gloomStalkerLocalStorage);
}