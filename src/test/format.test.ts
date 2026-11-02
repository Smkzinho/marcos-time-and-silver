import { describe, expect, it } from "vitest";
import { installmentText } from "@/lib/format";

describe("parcelamento", () => {
  it("limita a 10x sem juros", () => {
    expect(installmentText(1000)).toContain("10x");
  });
  it("respeita parcela mínima de R$ 50", () => {
    expect(installmentText(169.9)).toContain("3x");
  });
});
