import { GetLocalStorage, ILocalStorageItem, SaveLocalStorage } from "@/utils/LocalStorage";
import { GloomStalkerInfo } from "./GloomStalkerTypes";

const storageKey = 'gloomstalker-storage';
const storageVersion = '1.0';
const defaultItem = {
	gloomStalkerInfo: {
		attackModifier: 12
	}
};

export interface GloomStalkerLocalStorage extends ILocalStorageItem {
	gloomStalkerInfo: GloomStalkerInfo;
}

export function GetLocalGloomStalkerStorage(): GloomStalkerLocalStorage {
	return GetLocalStorage<GloomStalkerLocalStorage>(storageKey, storageVersion, defaultItem);
}

export function SaveLocalGloomStalkerStorage(gloomStalkerLocalStorage: GloomStalkerLocalStorage) {
	SaveLocalStorage<GloomStalkerLocalStorage>(storageKey, storageVersion, gloomStalkerLocalStorage);
}