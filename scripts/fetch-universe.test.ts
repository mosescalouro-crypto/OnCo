import { describe, expect, it } from "vitest";
import { parseEvenOne } from "./fetch-universe";

describe("parseEvenOne", () => {
  it("reads quoted name, url and tag fields from the embedded companies array", () => {
    const html = `<script>const companies = [
      {name: "Arden Bio", url: "https://www.arden.bio/", tag: "immunology"},
      {name: 'Echo Immune', url: 'https://www.echoimmune.com/', tag: 'oncology'},
    ];</script>`;
    expect(parseEvenOne(html)).toEqual([
      { name: "Arden Bio", website: "https://www.arden.bio/", tag: "immunology" },
      { name: "Echo Immune", website: "https://www.echoimmune.com/", tag: "oncology" },
    ]);
  });

  it("returns nothing when the page has no companies array", () => {
    expect(parseEvenOne("<html><body>portfolio</body></html>")).toEqual([]);
  });

  it("does not execute JavaScript in the companies array", () => {
    const html = `companies = [{name: (globalThis.__oncoEvenonePwned = true, "Evil Co"), url: "https://evil.example/", tag: "x"}];`;
    expect(parseEvenOne(html)).toEqual([]);
    expect((globalThis as { __oncoEvenonePwned?: boolean }).__oncoEvenonePwned).toBeUndefined();
  });
});
