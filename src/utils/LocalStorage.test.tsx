import { beforeEach, describe, expect, it } from 'vitest';
import { GetLocalStorage, ILocalStorageItem, SaveLocalStorage } from './LocalStorage';

interface TestItem extends ILocalStorageItem {
	nested: { count: number };
	list: number[];
}

const storageKey = 'test-storage';
const storageVersion = '1.0';
const defaultItem: TestItem = {
	nested: { count: 0 },
	list: [],
};

beforeEach(() => {
	localStorage.clear();
});

describe('GetLocalStorage', () => {
	it('round-trips a saved item', () => {
		const item: TestItem = { nested: { count: 5 }, list: [1, 2, 3] };
		SaveLocalStorage(storageKey, storageVersion, item);

		const result = GetLocalStorage<TestItem>(storageKey, storageVersion, defaultItem);

		expect(result).toEqual({ ...item, storageVersion });
	});

	it('falls back to the default item on a storage version mismatch', () => {
		SaveLocalStorage<TestItem>(storageKey, '0.9', { nested: { count: 5 }, list: [1, 2, 3] });

		const result = GetLocalStorage<TestItem>(storageKey, storageVersion, defaultItem);

		expect(result).toEqual({ ...defaultItem, storageVersion });
	});

	it('falls back to the default item instead of throwing on a corrupt/non-JSON value', () => {
		localStorage.setItem(storageKey, 'not valid json {{{');

		expect(() => GetLocalStorage<TestItem>(storageKey, storageVersion, defaultItem)).not.toThrow();
		expect(GetLocalStorage<TestItem>(storageKey, storageVersion, defaultItem)).toEqual({ ...defaultItem, storageVersion });
	});

	it('falls back to the default item when "null" is stored under the key', () => {
		localStorage.setItem(storageKey, 'null');

		const result = GetLocalStorage<TestItem>(storageKey, storageVersion, defaultItem);

		expect(result).toEqual({ ...defaultItem, storageVersion });
	});

	it('does not share nested object/array references across separate default fallbacks', () => {
		const first = GetLocalStorage<TestItem>(storageKey, storageVersion, defaultItem);
		const second = GetLocalStorage<TestItem>(storageKey, storageVersion, defaultItem);

		expect(first.nested).not.toBe(second.nested);
		expect(first.list).not.toBe(second.list);
		expect(first.nested).not.toBe(defaultItem.nested);
		expect(first.list).not.toBe(defaultItem.list);
	});
});

describe('SaveLocalStorage', () => {
	it('does not mutate the object it was handed', () => {
		const item: TestItem = { nested: { count: 1 }, list: [1] };

		SaveLocalStorage(storageKey, storageVersion, item);

		expect(item).toEqual({ nested: { count: 1 }, list: [1] });
		expect(item.storageVersion).toBeUndefined();
	});
});
