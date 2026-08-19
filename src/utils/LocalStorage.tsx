export interface ILocalStorageItem {
	storageVersion?: string;
};

// Get Local Storage or Default
export function GetLocalStorage<T extends ILocalStorageItem>(storageKey: string, storageVersion: string, defaultItem: T): T {
	const savedStorageStr = localStorage.getItem(storageKey);

	// if we found a value
	if (savedStorageStr) {
		try {
			const savedStorage = JSON.parse(savedStorageStr);

			// and if the storage matches the schema version we expect
			if (savedStorage && typeof savedStorage === 'object' && savedStorage.storageVersion === storageVersion) {
				return savedStorage;
			}
		} catch {
			// corrupt/non-JSON value under this key; fall through to default
		}
	}

	// return deep copy of default, with storage version added
	return { ...structuredClone(defaultItem), storageVersion } as T;
}

export function SaveLocalStorage<T extends ILocalStorageItem>(storageKey: string, storageVersion: string, localStorageItem: T) {
	localStorageItem.storageVersion = storageVersion;
	localStorage.setItem(storageKey, JSON.stringify(localStorageItem));
}