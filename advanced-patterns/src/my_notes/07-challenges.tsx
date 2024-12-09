// 💪Challenge 01: Merge Dynamic Objects with Global Objects
import { z, ZodError } from "zod";
import { Equal, Expect } from "../helpers/type-utils";
import express, { RequestHandler } from "express";
import { expect, it } from "vitest";
import { ParsedQs } from "qs";
import React from "react";

const addAllOfThisToWindow = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => a / b,
};

Object.assign(window, addAllOfThisToWindow);

type Custom = typeof addAllOfThisToWindow;

declare global {
  interface Window extends Custom {}
}

type test1 = [
  Expect<Equal<typeof window.add, (a: number, b: number) => number>>,
  Expect<Equal<typeof window.subtract, (a: number, b: number) => number>>,
  Expect<Equal<typeof window.multiply, (a: number, b: number) => number>>,
  Expect<Equal<typeof window.divide, (a: number, b: number) => number>>,
];

// 💪Challenge 02: Narrowing with an Array
interface Fruit {
  name: string;
  price: number;
}

export const wrapFruit = <const TFruits extends readonly Fruit[]>(
  fruits: TFruits
) => {
  const getFruit = <TName extends TFruits[number]["name"]>(name: TName) => {
    return fruits.find((fruit) => fruit.name === name) as Extract<
      TFruits[number],
      { name: TName }
    >;
  };

  return {
    getFruit,
  };
};

const fruits = wrapFruit([
  {
    name: "apple",
    price: 1,
  },
  {
    name: "banana",
    price: 2,
  },
]);

const banana = fruits.getFruit("banana");
const apple = fruits.getFruit("apple");
// @ts-expect-error
const notAllowed = fruits.getFruit("not-allowed");

type test2 = [
  Expect<Equal<typeof apple, { readonly name: "apple"; readonly price: 1 }>>,
  Expect<Equal<typeof banana, { readonly name: "banana"; readonly price: 2 }>>,
];

// 💪Challenge 03: Create a Type Safe Request Handler with Zod and Express
const makeTypeSafeHandler = <
  TQuery extends ParsedQs = any,
  TBody extends Record<string, any> = any,
>(
  config: {
    query?: z.Schema<TQuery>;
    body?: z.Schema<TBody>;
  },
  handler: RequestHandler<any, any, TBody, TQuery>
): RequestHandler<any, any, TBody, TQuery> => {
  return (req, res, next) => {
    const { query, body } = req;
    if (config.query) {
      try {
        config.query.parse(query);
      } catch (e) {
        return res.status(400).send((e as ZodError).message);
      }
    }
    if (config.body) {
      try {
        config.body.parse(body);
      } catch (e) {
        return res.status(400).send((e as ZodError).message);
      }
    }
    return handler(req, res, next);
  };
};

const app = express();

it("Should make the query AND body type safe", () => {
  app.get(
    "/users",
    makeTypeSafeHandler(
      {
        query: z.object({
          id: z.string(),
        }),
        body: z.object({
          name: z.string(),
        }),
      },
      (req, res) => {
        type tests = [
          Expect<Equal<typeof req.query, { id: string }>>,
          Expect<Equal<typeof req.body, { name: string }>>,
        ];
      }
    )
  );
});

it("Should default them to any if not passed in config", () => {
  app.get(
    "/users",
    makeTypeSafeHandler({}, (req, res) => {
      type tests = [
        Expect<Equal<typeof req.query, any>>,
        Expect<Equal<typeof req.body, any>>,
      ];
    })
  );
});

// 💪Challenge 04: Building a Dynamic Reducer
// Clue - this will be needed!
/*
type PayloadsToDiscriminatedUnion<T extends Record<string, any>> = {
  [K in keyof T]: { type: K } & T[K];
}[keyof T];

type TestingPayloadsToDiscriminatedUnion = PayloadsToDiscriminatedUnion<{
  LOG_IN: { username: string; password: string };
  LOG_OUT: {};
}>;

export class DynamicReducer<T> {
  private handlers = {} as unknown;

  addHandler(
    type: string,
    handler: (state: unknown, payload: unknown) => unknown
  ): unknown {
    this.handlers[type] = handler;

    return this;
  }

  reduce(state: unknown, action: unknown): unknown {
    const handler = this.handlers[action.type];
    if (!handler) {
      return state;
    }

    return handler(state, action);
  }
}

interface State {
  username: string;
  password: string;
}

const reducer = new DynamicReducer<State>()
  .addHandler(
    "LOG_IN",
    (state, action: { username: string; password: string }) => {
      return {
        username: action.username,
        password: action.password,
      };
    }
  )
  .addHandler("LOG_OUT", () => {
    return {
      username: "",
      password: "",
    };
  });

it("Should return the new state after LOG_IN", () => {
  const state = reducer.reduce(
    { username: "", password: "" },
    { type: "LOG_IN", username: "foo", password: "bar" }
  );

  type test = [Expect<Equal<typeof state, State>>];

  expect(state).toEqual({ username: "foo", password: "bar" });
});

it("Should return the new state after LOG_OUT", () => {
  const state = reducer.reduce(
    { username: "foo", password: "bar" },
    { type: "LOG_OUT" }
  );

  type test = [Expect<Equal<typeof state, State>>];

  expect(state).toEqual({ username: "", password: "" });
});

it("Should error if you pass it an incorrect action", () => {
  const state = reducer.reduce(
    { username: "foo", password: "bar" },
    {
      // @ts-expect-error
      type: "NOT_ALLOWED",
    }
  );
});

it("Should error if you pass an incorrect payload", () => {
  const state = reducer.reduce(
    { username: "foo", password: "bar" },
    // @ts-expect-error
    {
      type: "LOG_IN",
    }
  );
});

*/

// 💪Challenge 05:
/**
 * How do we add a new base element to React's JSX?
 *
 * You'll need to do some detective work: check
 * out JSX.IntrinsicElements.
 *
 * The JSX namespace comes from React - you'll need
 * to check out React's type definitions.
 */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "custom-element": {
        children?: React.ReactNode;
        yourName?: string;
      };
    }
  }
}

const element = <custom-element yourName="Ishu">hello world</custom-element>;
