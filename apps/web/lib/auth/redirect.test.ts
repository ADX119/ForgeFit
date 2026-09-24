import { describe, expect, it } from "vitest";
import { failedLinkPath, safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("defaults by link type", () => {
    expect(safeNextPath(null, "email")).toBe("/onboarding");
    expect(safeNextPath(null, "recovery")).toBe("/update-password");
  });

  it("keeps same-site paths", () => {
    expect(safeNextPath("/update-password", null)).toBe("/update-password");
  });

  it("rejects anything that could leave the site", () => {
    for (const next of ["https://evil.example", "//evil.example", "/\\evil.example", "evil"]) {
      expect(safeNextPath(next, "email")).toBe("/onboarding");
    }
  });
});

describe("failedLinkPath", () => {
  it("sends failed reset links back to request a new one", () => {
    expect(failedLinkPath("/update-password")).toBe("/forgot-password?error=link");
    expect(failedLinkPath("/onboarding")).toBe("/login?error=confirmation");
  });
});
