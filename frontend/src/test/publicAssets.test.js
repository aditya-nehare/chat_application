import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

describe("public/login.png", () => {
  const filePath = path.resolve(currentDir, "../../public/login.png");

  it("exists on disk so LoginPage's <img src=\"/login.png\"> resolves", () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it("is a non-empty file", () => {
    const stats = statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);
  });
});