import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("../db", () => mocks);

import { adminRouter } from "./admin";

function context(role: "admin" | "user") {
  return {
    user: { id: 1, openId: "owner-1", name: "Owner", email: null, loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: {} as any,
    res: {} as any,
  };
}

function queryResult(rows: unknown[]) {
  const promise = Promise.resolve(rows) as Promise<unknown[]> & { orderBy: () => Promise<unknown[]> };
  promise.orderBy = () => promise;
  return { from: () => promise };
}

function chainedQuery(rows: unknown[]) {
  const promise = Promise.resolve(rows) as Promise<unknown[]> & {
    orderBy: () => Promise<unknown[]>;
    where: () => typeof promise;
    limit: () => Promise<unknown[]>;
  };
  promise.orderBy = () => promise;
  promise.where = () => promise;
  promise.limit = () => promise;
  return { from: () => promise };
}

describe("administrator content review", () => {
  it("rejects the catalog API for non-administrator learners", async () => {
    const caller = adminRouter.createCaller(context("user"));
    await expect(caller.catalog()).rejects.toThrow("required permission");
    expect(mocks.getDb).not.toHaveBeenCalled();
  });

  it("returns completed levels in CEFR order with their module lesson maps", async () => {
    mocks.getDb.mockResolvedValue({
      select: vi.fn()
        .mockImplementationOnce(() => queryResult([{ id: 2, code: "B1", title: "Intermediate", titleArabic: "متوسط", totalLessons: 24 }, { id: 1, code: "A1", title: "Starter", titleArabic: "مبتدئ", totalLessons: 20 }]))
        .mockImplementationOnce(() => queryResult([{ id: 11, levelId: 1, moduleNumber: 1, title: "Foundations" }, { id: 21, levelId: 2, moduleNumber: 1, title: "Perspectives" }]))
        .mockImplementationOnce(() => queryResult([{ id: 101, levelId: 1, moduleId: 11, topicId: null, lessonNumber: 1, title: "Hello", titleArabic: "مرحباً" }, { id: 201, levelId: 2, moduleId: 21, topicId: null, lessonNumber: 1, title: "Views", titleArabic: "آراء" }])),
    } as any);

    const caller = adminRouter.createCaller(context("admin"));
    const catalog = await caller.catalog();

    expect(catalog.map(level => level.code)).toEqual(["A1", "B1"]);
    expect(catalog[0].modules[0].lessons[0].title).toBe("Hello");
    expect(catalog[1].modules[0].lessons[0].titleArabic).toBe("آراء");
  });

  it("resolves a selected lesson after its direct review catalog entry is loaded", async () => {
    const db = {
      select: vi.fn()
        .mockImplementationOnce(() => chainedQuery([{ id: 1, code: "A1", title: "Starter", titleArabic: "مبتدئ", totalLessons: 20 }]))
        .mockImplementationOnce(() => chainedQuery([{ id: 11, levelId: 1, moduleNumber: 1, title: "Foundations" }]))
        .mockImplementationOnce(() => chainedQuery([{ id: 101, levelId: 1, moduleId: 11, topicId: null, lessonNumber: 1, title: "Hello", titleArabic: "مرحباً" }]))
        .mockImplementationOnce(() => chainedQuery([{ id: 1, code: "A1" }]))
        .mockImplementationOnce(() => chainedQuery([{ id: 101, levelId: 1, moduleId: 11, topicId: null, lessonNumber: 1, title: "Hello", titleArabic: "مرحباً", learningPlan: { outcome: { canDo: "Introduce yourself" } } }]))
        .mockImplementationOnce(() => chainedQuery([{ id: 1001, word: "hello", arabic: "مرحباً" }]))
        .mockImplementationOnce(() => chainedQuery([]))
        .mockImplementationOnce(() => chainedQuery([{ id: 2001, title: "Greeting note", questions: [] }]))
        .mockImplementationOnce(() => chainedQuery([{ id: 3001, title: "Introduce yourself", minimumWords: 30 }]))
        .mockImplementationOnce(() => chainedQuery([{ id: 4001, questionKey: "a1-l1-q1", active: 1 }])),
    } as any;
    mocks.getDb.mockResolvedValue(db);

    const caller = adminRouter.createCaller(context("admin"));
    const catalog = await caller.catalog();
    const selected = catalog[0].modules[0].lessons[0];
    const detail = await caller.lesson({ level: catalog[0].code as "A1", lessonNumber: selected.lessonNumber });

    expect(detail?.lesson.title).toBe("Hello");
    expect(detail?.vocabulary).toHaveLength(1);
    expect(detail?.readings[0].title).toBe("Greeting note");
    expect(db.select).toHaveBeenCalledTimes(10);
  });
});
