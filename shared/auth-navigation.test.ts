import { describe, expect, it } from "vitest";
import { resolvePostLoginReturnPath } from "./auth-navigation";

describe("protected review return navigation", () => {
  it("restores the requested direct review workspace after a sign-in return", () => {
    expect(resolvePostLoginReturnPath("/?review=1", "/")).toBe("/?review=1");
  });

  it("does not redirect when the stored path is the current path or external", () => {
    expect(resolvePostLoginReturnPath("/?review=1", "/?review=1")).toBeNull();
    expect(resolvePostLoginReturnPath("https://example.test", "/")).toBeNull();
    expect(resolvePostLoginReturnPath("//example.test", "/")).toBeNull();
  });
});
