import { it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

// 🪶Note 29: Identity Functions as an Alternative to the as const
export const asConst = <const T>(t: T): T => t;

const fruits = asConst([
  {
    name: "apple",
    price: 1,
  },
  {
    name: "banana",
    price: 2,
  },
]);

type test1 = [
  Expect<
    Equal<
      typeof fruits,
      readonly [
        {
          readonly name: "apple";
          readonly price: 1;
        },
        {
          readonly name: "banana";
          readonly price: 2;
        },
      ]
    >
  >,
];

// 🪶Note 30: Add Constraints to an Identity Function
export const narrowFruits = <
  const TFruits extends readonly { name: string; price: number }[],
>(
  t: TFruits
) => t;

const fruitsData = narrowFruits([
  {
    name: "apple",
    price: 1,
  },
  {
    name: "banana",
    price: 2,
  },
]);

type test = typeof fruitsData;

type test2 = [
  Expect<
    Equal<
      typeof fruitsData,
      readonly [
        {
          readonly name: "apple";
          readonly price: 1;
        },
        {
          readonly name: "banana";
          readonly price: 2;
        },
      ]
    >
  >,
];

it("Should ONLY let you pass an array of fruits", () => {
  const notAllowed = narrowFruits([
    // @ts-expect-error
    "not allowed",
  ]);
});

// 🪶Note 31: Specifying Where Inference Should Not Happen
type NoInfer<T> = [T][T extends any ? 0 : never];

interface FSMConfig<TState extends string> {
  initial: NoInfer<TState>;
  states: Record<
    TState,
    {
      onEntry?: () => void;
    }
  >;
}

export const makeFiniteStateMachine = <TState extends string>(
  config: FSMConfig<TState>
) => config;

const config = makeFiniteStateMachine({
  initial: "a",
  states: {
    a: {
      onEntry: () => {
        console.log("a");
      },
    },
    // b should be allowed to be specified!
    b: {},
  },
});

const config2 = makeFiniteStateMachine({
  // c should not be allowed! It doesn't exist on the states below
  // @ts-expect-error
  initial: "c",
  states: {
    a: {},
    // b should be allowed to be specified!
    b: {},
  },
});

// 🪶Note 32: Find the Generic Flow of an Identity Function
interface Config<R extends `/${string}`> {
  routes: R[];
  fetchers: { [K in R]?: () => any };
}

const makeConfigObj = <TRoute extends `/${string}`>(config: Config<TRoute>) =>
  config;

makeConfigObj({
  routes: ["/", "/about", "/contact"],
  fetchers: {
    // @ts-expect-error
    "/does-not-exist": () => {
      return {};
    },
  },
});

export const configObj: Config<"/" | "/about" | "/contact"> = {
  routes: ["/", "/about", "/contact"],
  fetchers: {
    // @ts-expect-error
    "/does-not-exist": () => {
      return {};
    },
  },
};

// 🪶Note 33: Reverse Mapped Types
export function makeEventHandlers<TObj>(obj: {
  [E in keyof TObj]: (name: E) => any;
}) {
  return obj;
}

const obj = makeEventHandlers({
  click: (name) => {
    console.log(name);

    type test = Expect<Equal<typeof name, "click">>;
  },
  focus: (name) => {
    console.log(name);

    type test = Expect<Equal<typeof name, "focus">>;
  },
});