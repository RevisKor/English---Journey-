import { describe, expect, it } from "vitest";
import { markTutorialSeen, shouldOpenTutorial, tutorialStorageKey } from "./Home";

type MemoryStorage = Storage;

function memoryStorage(): MemoryStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
    clear: () => { values.clear(); },
    key: (index) => Array.from(values.keys())[index] ?? null,
    get length() { return values.size; },
  } as MemoryStorage;
}

describe("first-use course guide state", () => {
  it("opens on first visit, stays closed after dismissal, and reopens manually", () => {
    const storage = memoryStorage();

    expect(shouldOpenTutorial("A1", storage)).toBe(true);
    markTutorialSeen("A1", storage);
    expect(storage.getItem(tutorialStorageKey("A1"))).toBe("1");
    expect(shouldOpenTutorial("A1", storage)).toBe(false);
    expect(shouldOpenTutorial("A1", storage, true)).toBe(true);
  });

  it("keeps tutorial state separate for each level", () => {
    const storage = memoryStorage();
    markTutorialSeen("A1", storage);

    expect(shouldOpenTutorial("A1", storage)).toBe(false);
    expect(shouldOpenTutorial("A2", storage)).toBe(true);
  });
});
