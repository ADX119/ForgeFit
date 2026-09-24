import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("PWA manifest", () => {
  it("is installable with branded maskable icons", () => {
    const value = manifest();
    expect(value.display).toBe("standalone");
    expect(value.start_url).toBe("/today");
    expect(value.icons).toHaveLength(2);
    expect(value.icons?.every((icon) => icon.purpose === "maskable")).toBe(true);
  });
});
