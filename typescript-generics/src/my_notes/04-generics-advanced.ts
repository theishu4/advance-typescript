import { CSSProperties } from "react";

// 🪶Note 18: Generics with Conditional Types
function youSayGoodbyeISayHello<T extends "hello" | "goodbye">(greeting: T) {
  return (greeting === "goodbye" ? "hello" : "goodbye") as T extends "hello"
    ? "goodbye"
    : "hello";
}

const returnGoodbye = youSayGoodbyeISayHello("hello");
const returnHello = youSayGoodbyeISayHello("goodbye");

// 🪶Note 19: Fixing Errors in Generic Functions
type Person = {
  name: string;
  age: number;
  birthdate: Date;
};

export function remapPerson<Key extends keyof Person>(
  key: Key,
  value: Person[Key]
): Person[Key] {
  if (key === "birthdate") {
    return new Date() as Person[Key];
  }

  return value;
}

const date = remapPerson("birthdate", new Date());
const num = remapPerson("age", 42);
const name = remapPerson("name", "John Doe");

// 🪶Note 20: Generic Function Currying
export const curryFunction =
  <T>(t: T) =>
  <U>(u: U) =>
  <V>(v: V) => {
    return {
      t,
      u,
      v,
    };
  };

const numNumNum = curryFunction(1)(2)(3);
const strNumStr = curryFunction("Ishu")(2)("Anshu");

// 🪶Note 21: Generic Interfaces with Functions
export interface Cache<T> {
  get: (key: string) => T | undefined;
  set: (key: string, value: T) => void;
  // You can fix this by only changing the line below!
  clone: <R>(transform: (elem: T) => R) => Cache<R>;
}

const createCache = <T>(initialCache?: Record<string, T>): Cache<T> => {
  const cache: Record<string, T> = initialCache || {};

  return {
    get: (key) => cache[key],
    set: (key, value) => {
      cache[key] = value;
    },
    clone: (transform) => {
      const newCache: Record<string, any> = {};

      for (const key in cache) {
        newCache[key] = transform(cache[key]);
      }
      return createCache(newCache);
    },
  };
};

const cache = createCache<number>();

cache.set("a", 1);
cache.set("b", 2);

cache.get("a"); // 1
cache.get("b"); // 2

const numberCache = createCache<number>();

numberCache.set("a", 1);
numberCache.set("b", 2);

const stringCache = numberCache.clone((elem) => {
  return String(elem);
});

const a = stringCache.get("a"); // typeof a === string | undefined

// 🪶Note 22: Spotting Useless Generics
const returnBothOfWhatIPassIn = <Params extends Record<"a" | "b", unknown>>(
  params: Params
): [Params["a"], Params["b"]] => {
  return [params.a, params.b];
};

const result = returnBothOfWhatIPassIn({
  a: "a",
  b: true,
});

// 🪶Note 23: Spotting Missing Generics
const getValue = <TObj, TKey extends keyof TObj>(
  obj: TObj,
  key: TKey
): TObj[TKey] => {
  return obj[key];
};

const obj = {
  a: 1,
  b: "some-string",
  c: true,
};

const numberResult = getValue(obj, "a");
const stringResult = getValue(obj, "b");
const booleanResult = getValue(obj, "c");

// 🪶Note 24: Refactoring Generics for a Cleaner API
/**
 * In this implementation, we need to specify the theme
 * inside useStyled wherever we use it. This is not ideal.
 *
 * See if you can refactor useStyled into a function called
 * makeUseStyled which returns a useStyled function, typed
 * with the theme.
 *
 * Desired API:
 *
 * const useStyled = makeUseStyled<MyTheme>();
 */

const makeUseStyled = <TTheme = {}>() => {
  const useStyled = (func: (theme: TTheme) => CSSProperties) => {
    // Imagine that this function hooks into a global theme
    // and returns the CSSProperties
    return {} as CSSProperties;
  };

  return useStyled;
};

interface MyTheme {
  color: {
    primary: string;
  };
  fontSize: {
    small: string;
  };
}

const useStyled = makeUseStyled<MyTheme>();

const buttonStyle = useStyled((theme) => ({
  color: theme.color.primary,
  fontSize: theme.fontSize.small,
}));

const divStyle = useStyled((theme) => ({
  backgroundColor: theme.color.primary,
}));

// 🪶Note 25: The Partial Inference Problem
interface Source {
  firstName: string;
  middleName: string;
  lastName: string;
}

const makeSelectors = <
  TSource = "makeSelector excepts to be passed a type argument",
>() => {
  return <TSelectors extends Record<string, (source: TSource) => any>>(
    selectors: TSelectors
  ) => {
    return selectors;
  };
};

/**
 * We've got a problem here. We want to be able to infer the type
 * of the selectors object from what we passed in to makeSelectors.
 *
 * But we can't. As soon as we pass ONE type argument, inference
 * doesn't work on the other type arguments. We want to refactor this
 * so that we can infer the type of the selectors object.
 *
 * Desired API:
 *
 * makeSelectors<Source>()({ ...selectorsGoHere })
 */
const selectors = makeSelectors<Source>()({
  getFullName: (source) =>
    `${source.firstName} ${source.middleName} ${source.lastName}`,
  getFirstAndLastName: (source) => `${source.firstName} ${source.lastName}`,
  getFirstNameLength: (source) => source.firstName.length,
});

type funReturnString = (typeof selectors)["getFullName"];
