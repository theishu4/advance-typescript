import _ from "lodash";
import { fetchUser } from "fake-external-lib";
import {
  doNotExecute,
  Equal,
  Expect,
  ExpectExtends,
} from "../helpers/type-utils";
import { expect, it } from "vitest";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { z } from "zod";
import { getAnimatingState } from "overridingTypes";

// 🪶Note 24: Extract Types to Extend an External Library
/**
 * We're using a function from fake-external lib, but we need
 * to extend the types. Extract the types below.
 */
type ParametersOfFetchUser = Parameters<typeof fetchUser>;
type ReturnTypeOfFetchUserWithFullName = Awaited<
  ReturnType<typeof fetchUser>
> & { fullName: string };

export const fetchUserWithFullName = async (
  ...args: ParametersOfFetchUser
): Promise<ReturnTypeOfFetchUserWithFullName> => {
  const user = await fetchUser(...args);
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  };
};

type tests = [
  Expect<Equal<ParametersOfFetchUser, [string]>>,
  Expect<
    ExpectExtends<
      { id: string; firstName: string; lastName: string; fullName: string },
      ReturnTypeOfFetchUserWithFullName
    >
  >,
];

// 🪶Note 25: Finding Proper Type Arguments and Generics with Lodash
const groupByAge = <T extends { age: number }>(array: T[]) => {
  const grouped = _.groupBy(array, "age");

  return grouped;
};

const result = groupByAge([
  {
    name: "John",
    age: 20,
  },
  {
    name: "Jane",
    age: 20,
  },
  {
    name: "Mary",
    age: 30,
  },
]);

it("Should group the items by age", () => {
  expect(result).toEqual({
    20: [
      {
        name: "John",
        age: 20,
      },
      {
        name: "Jane",
        age: 20,
      },
    ],
    30: [
      {
        name: "Mary",
        age: 30,
      },
    ],
  });

  type tests = [
    Expect<Equal<typeof result, _.Dictionary<{ name: string; age: number }[]>>>,
  ];
});

it("Should not let you pass in an array of objects NOT containing age", () => {
  doNotExecute(() => {
    groupByAge([
      {
        // @ts-expect-error
        name: "John",
      },
      {
        // @ts-expect-error
        name: "Bill",
      },
    ]);
  });
});

// 🪶Notes 26: Add Query Params to an Express Request
const app = express();

const makeTypeSafeGet =
  <TQuery extends Request["query"]>(
    parser: (queryParams: Request["query"]) => TQuery,
    handler: RequestHandler<any, any, any, TQuery>
  ) =>
  (req: Request<any, any, any, TQuery>, res: Response, next: NextFunction) => {
    try {
      parser(req.query);
    } catch (e) {
      res.status(400).send("Invalid query: " + (e as Error).message);
      return;
    }

    return handler(req, res, next);
  };

const getUser = makeTypeSafeGet(
  (query) => {
    if (typeof query.id !== "string") {
      throw new Error("You must pass an id");
    }

    return {
      id: query.id,
    };
  },
  (req, res) => {
    // req.query should be EXACTLY the type returned from
    // the parser above
    type tests = [Expect<Equal<typeof req.query, { id: string }>>];

    res.json({
      id: req.query.id,
      name: "Matt",
    });
  }
);

app.get("/user", getUser);

// 🪶Note 27: Create a Runtime and Type Safe Function with Generics and Zod
const makeZodSafeFunction = <TParam, TReturn>(
  schema: z.Schema<TParam>,
  func: (arg: TParam) => TReturn
) => {
  return (arg: TParam) => {
    const result = schema.parse(arg);
    return func(result);
  };
};

const addTwoNumbersArgSchema = z.object({
  a: z.number(),
  b: z.number(),
});

const addTwoNumbers = makeZodSafeFunction(
  addTwoNumbersArgSchema,
  (args) => args.a + args.b
);

it("Should error on the type level AND the runtime if you pass incorrect params", () => {
  expect(() =>
    addTwoNumbers(
      // @ts-expect-error
      { a: 1, badParam: 3 }
    )
  ).toThrow();
});

it("Should succeed if you pass the correct type", () => {
  expect(addTwoNumbers({ a: 1, b: 2 })).toBe(3);
});

// 🪶Note 28. Override External Library Types
const animatingState = getAnimatingState();

type test = [
  Expect<
    Equal<
      typeof animatingState,
      "before-animation" | "animating" | "after-animation"
    >
  >,
];

type fun = () => "Ishu" | "Anshu";
