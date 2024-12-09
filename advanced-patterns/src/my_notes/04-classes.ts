import { Equal, Expect } from "../helpers/type-utils";
import { expect, it } from "vitest";
import { fetchUser } from "fake-external-lib";

// 🪶Note 17: Classes as Types and Values
class CustomError extends Error {
  constructor(
    message: string,
    public code: number
  ) {
    super(message);
    this.name = "CustomError";
  }
}

const handleCustomError = (error: CustomError) => {
  console.error(error.code);

  type test = Expect<Equal<typeof error.code, number>>;
};

// 🪶Note 18: Dive into Classes with Type Predicates
class Form<TValues> {
  error?: string;

  constructor(
    public values: TValues,
    private validate: (values: TValues) => string | void
  ) {}

  /**
   * 💎💎💎
   *
   * We can use : this is Form<TValues>
   *
   * first `this` referring to object from where it it called.
   *
   * second `this` referring to typeof current class.
   *
   * ❓Can we use only `this is {error: string}`. Same for Note 19.
   */
  isInvalid(): this is this & { error: string } {
    const result = this.validate(this.values);

    if (typeof result === "string") {
      this.error = result;
      return true;
    }

    this.error = undefined;
    return false;
  }
}

const form = new Form(
  {
    username: "",
    password: "",
  },
  (values) => {
    if (!values.username) {
      return "Username is required";
    }

    if (!values.password) {
      return "Password is required";
    }
  }
);

if (form.isInvalid()) {
  type test1 = Expect<Equal<typeof form.error, string>>;
} else {
  type test2 = Expect<Equal<typeof form.error, string | undefined>>;
}

// 🪶Note 19: Assertion Functions and Classes
interface User {
  id: string;
}

class SDK {
  loggedInUser?: User;

  constructor(loggedInUser?: User) {
    this.loggedInUser = loggedInUser;
  }

  assertIsLoggedIn(): asserts this is this & { loggedInUser: User } {
    if (!this.loggedInUser) {
      throw new Error("Not logged in");
    }
  }

  createPost(title: string, body: string) {
    type test1 = Expect<Equal<typeof this.loggedInUser, User | undefined>>;

    this.assertIsLoggedIn();

    type test2 = Expect<Equal<typeof this.loggedInUser, User>>;
  }
}

// 🪶Note 20: Class Implementation Following the Builder Pattern Explanation
// Go to -> src\04-classes\19.3-builder-pattern-intro.explainer.ts

// 🪶Note 21: Create a Type Safe Map with the Builder Pattern
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
  ): TypeSafeStringMap<Record<keyof TMap | K, string>> {
    (this.map[key] as any) = value;

    return this;
  }
}

const map = new TypeSafeStringMap()
  .set("matt", "pocock")
  .set("jools", "holland")
  .set("brandi", "carlile");

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
});

// 🪶Note 22. Importance of default generic
class TypeSafeStringMap2<TMap extends Record<string, string> = {}> {
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
  ): TypeSafeStringMap2<TMap | Record<keyof TMap | K, string>> {
    (this.map[key] as any) = value;

    return this;
  }
}

const mapObject = new TypeSafeStringMap2()
  .set("matt", "pocock")
  .set("jools", "holland")
  .set("brandi", "carlile");

it("Should not allow getting values which do not exist", () => {
  mapObject.get(
    // @ts-expect-error
    "jim"
  );
});

// 🪶Note 23: Building Chainable Middleware with the Builder Pattern
type Middleware<TInput, TOutput> = (
  input: TInput
) => TOutput | Promise<TOutput>;

/**
 * In this problem, we need to type the return type of the use()
 * method to make it update the TOutput generic with a new one.
 *
 * Currently, the use method just uses the same TOutput as the
 * first middleware you pass in. But it should infer the _new_
 * output from the middleware you pass in.
 */
class DynamicMiddleware<TInput, TOutput> {
  private middleware: Middleware<any, any>[] = [];

  constructor(firstMiddleware: Middleware<TInput, TOutput>) {
    this.middleware.push(firstMiddleware);
  }

  // Clue: you'll need to make changes here!
  use<UReturn>(
    middleware: Middleware<TOutput, UReturn>
  ): DynamicMiddleware<TInput, UReturn> {
    this.middleware.push(middleware);

    return this as any;
    //          ^ You'll need the 'as any'!
  }

  async run(input: TInput): Promise<TOutput> {
    let result: TOutput = input as any;

    for (const middleware of this.middleware) {
      result = await middleware(result);
    }

    return result;
  }
}

const middleware = new DynamicMiddleware((req: Request) => {
  return {
    ...req,
    // Transforms /user/123 to 123
    userId: req.url.split("/")[2],
  };
})
  .use((req) => {
    if (req.userId === "123") {
      throw new Error();
    }
    return req;
  })
  .use(async (req) => {
    return {
      ...req,
      user: await fetchUser(req.userId),
    };
  });

it("Should fail if the user id is 123", () => {
  expect(middleware.run({ url: "/user/123" } as Request)).rejects.toThrow();
});

it("Should return a request with a user", async () => {
  const result = await middleware.run({ url: "/user/matt" } as Request);

  expect(result.user.id).toBe("matt");
  expect(result.user.firstName).toBe("John");
  expect(result.user.lastName).toBe("Doe");
});
