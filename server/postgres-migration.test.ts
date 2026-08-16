import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Vercel Postgres initialization migration", () => {
  it("declares every enum required by learner tables before creating those tables", () => {
    const migrationPath = resolve(process.cwd(), "drizzle/0000_fantastic_raider.sql");
    const migration = readFileSync(migrationPath, "utf8");

    for (const enumName of [
      "preferred_accent",
      "ai_action",
      "assessment_instance_status",
      "assessment_type",
      "interface_language",
      "progress_status",
      "review_item_type",
      "submission_kind",
      "user_role",
    ]) {
      expect(migration).toContain(`CREATE TYPE "public"."${enumName}" AS ENUM`);
    }

    expect(migration.indexOf('CREATE TYPE "public"."user_role" AS ENUM')).toBeLessThan(
      migration.indexOf('CREATE TABLE "users"'),
    );
    expect(migration.indexOf('CREATE TYPE "public"."progress_status" AS ENUM')).toBeLessThan(
      migration.indexOf('CREATE TABLE "lessonProgress"'),
    );
  });
});
