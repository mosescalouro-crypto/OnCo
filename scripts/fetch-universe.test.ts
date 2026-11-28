import { describe, expect, it } from "vitest";
import { parseEvenOne } from "./fetch-universe";

const page = (body: string) => `<html><body><script>${body}</script></body></html>`;

describe("parseEvenOne", () => {
  it("reads quoted name, url and tag from the companies array", () => {
    const html = page(`companies = [
      {name: "Arden Bio", url: "https://www.arden.bio/", tag: "immunology"},
      {name: 'Echo Immune', url: 'https://www.echoimmune.com/', tag: 'oncology'},
    ];`);
    expect(parseEvenOne(html)).toEqual([
      { name: "Arden Bio", website: "https://www.arden.bio/", tag: "immunology" },
      { name: "Echo Immune", website: "https://www.echoimmune.com/", tag: "oncology" },
    ]);
  });

  it("does not evaluate JavaScript in the array body", () => {
    const html = page(`companies = [(globalThis.__oncoPwned = true, {name: "Safe Co", url: "https://safe.example/", tag: "oncology"})];`);
    const items = parseEvenOne(html);
    expect((globalThis as { __oncoPwned?: boolean }).__oncoPwned).toBeUndefined();
    expect(items).toEqual([{ name: "Safe Co", website: "https://safe.example/", tag: "oncology" }]);
  });

  it("drops entries whose url is not http(s)", () => {
    const html = page(`companies = [
      {name: "Ok", url: "https://ok.example/", tag: "oncology"},
      {name: "Script", url: "javascript:alert(1)", tag: "oncology"},
    ];`);
    expect(parseEvenOne(html)).toEqual([{ name: "Ok", website: "https://ok.example/", tag: "oncology" }]);
  });

  it("returns nothing when the marker is missing", () => {
    expect(parseEvenOne("<html><body>no portfolio</body></html>")).toEqual([]);
  });
});
