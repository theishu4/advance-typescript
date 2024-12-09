import { expect, it } from "vitest";

class TypeSafeStringMap<TMap extends Record<string, string> = {}> {
  private map: TMap;
  constructor() {
    this.map = {} as TMap;
  }

  get(key: keyof TMap): string {
    return this.map[key];
  }

  set<K extends string>(
    key: K,
    value: string
  ): TypeSafeStringMap<TMap & Record<K, string>> {
    (this.map[key] as any) = value;

    return this;
  }
}

const map = new TypeSafeStringMap()
  .set("matt", "pocock")
  .set("jools", "holland")
  .set("brandi", "carlile");

map.set("ishu", "modanwal");

it("Should not allow getting values which do not exist", () => {
  map.get(
    // @ts-expect-error
    "jim"
  );
});

it("Should return values from keys which do exist", () => {
  expect(map.get("matt")).toBe("pocock");
  expect(map.get("jools")).toBe("holland");
  expect(map.get("brandi")).toBe("carlile");
  expect(map.get("ishu")).toBe("modanwal");
  // 👆 if true then get should except string in addition to inferred key.
});
