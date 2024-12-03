// 💪Challenge 01: Make An Infinite Scroll Function Generic with Correct Type Inference
type Params<TRow> = {
  key: keyof TRow;
  initialRows?: TRow[];
  fetchRows: () => Promise<TRow[]> | TRow[];
};
const makeInfiniteScroll = <TRow>(params: Params<TRow>) => {
  const data = params.initialRows || [];

  const scroll = async () => {
    const rows = await params.fetchRows();
    data.push(...rows);
  };

  return {
    scroll,
    getRows: () => data,
  };
};

const table = makeInfiniteScroll({
  key: "id",
  fetchRows: () => Promise.resolve([{ id: 1, name: "John" }]),
});

(async () => {
  await table.scroll();

  await table.scroll();
})();

makeInfiniteScroll({
  // @ts-expect-error
  key: "name",
  fetchRows: () =>
    Promise.resolve([
      {
        id: "1",
      },
    ]),
});

const { getRows } = makeInfiniteScroll({
  key: "id",
  initialRows: [
    {
      id: 1,
      name: "John",
    },
  ],
  fetchRows: () => Promise.resolve([]),
});

const rows = getRows();

// 💪Challenge 02: Create a Function with a Dynamic Number of Arguments
interface Events {
  click: {
    x: number;
    y: number;
  };
  focus: undefined;
}

export const sendEvent = <E extends keyof Events>(
  event: E,
  ...args: Events[E] extends {} ? [payload: Events[E]] : []
) => {
  // Send the event somewhere!
};

// @ts-expect-error
sendEvent("click");

sendEvent("click", {
  // @ts-expect-error
  x: "oh dear",
});

sendEvent(
  "click",
  // @ts-expect-error
  {
    y: 1,
  }
);

sendEvent("click", {
  x: 1,
  y: 2,
});

sendEvent("focus");

sendEvent(
  "focus",
  // @ts-expect-error
  {}
);

// 💪Challenge 03: Create a Pick Function
const pick = <TObj extends {}, P extends keyof TObj>(
  obj: TObj,
  picked: P[]
) => {
  return picked.reduce<{ [K in P]: TObj[K] }>((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as any);
};

const aAndB = pick(
  {
    a: 1,
    b: "Ishu",
    c: 3,
  },
  ["a", "b"]
);

pick(
  {
    a: 1,
    b: 2,
    c: 3,
  },
  [
    "a",
    "b",
    // @ts-expect-error
    "d",
  ]
);

// 💪Challenge 04: Create a Form Validation Library
const makeFormValidatorFactory =
  <TValidatorKeys extends string>(
    validators: Record<TValidatorKeys, (value: string) => string | void>
  ) =>
  <TConfigKeys extends string>(
    config: Record<TConfigKeys, TValidatorKeys[]>
  ) => {
    return (values: Record<TConfigKeys, string>) => {
      const errors = {} as { [K in TConfigKeys]: string | undefined };

      for (const key in config) {
        for (const validator of config[key]) {
          const error = validators[validator](values[key]);
          if (error) {
            errors[key] = error;
            break;
          }
        }
      }

      return errors;
    };
  };

const createFormValidator = makeFormValidatorFactory({
  required: (value) => {
    if (value === "") {
      return "Required";
    }
  },
  minLength: (value) => {
    if (value.length < 5) {
      return "Minimum length is 5";
    }
  },
  maxLength: (value) => {
    if (value.length > 35) {
      return "Maximum length is 35";
    }
  },
  email: (value) => {
    if (!value.includes("@")) {
      return "Invalid email";
    }
  },
});

const validateUser = createFormValidator({
  id: ["required"],
  username: ["required", "minLength", "maxLength"],
  email: ["required", "email"],
  password: ["required", "minLength"],
});

/**
 * **Return the following errors:**
 * ```typescript
 * {
    username: "Minimum length is 5",
    email: "Invalid email",
  })
  ```
 */
const errors = validateUser({
  id: "1",
  username: "john",
  email: "Blah",
  password: "12345",
});

createFormValidator({
  // @ts-expect-error
  id: ["i-do-not-exist"],
});

const validator = createFormValidator({
  id: ["required"],
});

validator({
  // @ts-expect-error
  name: "123",
});

// 💪Challenge 05:  Improve a Fetch Function to Handle Missing Type Arguments
const fetchData = async <
  TResult = "You must pass a type argument to fetchData",
>(
  url: string
): Promise<TResult> => {
  const data = await fetch(url).then((response) => response.json());
  return data;
};

(async () => {
  /**
   * data.name = "Luke Skywalker"
   */
  const data = await fetchData<{ name: string }>(
    "https://swapi.dev/api/people/1"
  );
})();

(async () => {
  const data = await fetchData("https://swapi.dev/api/people/1");

  // type of data should be: "You must pass a type argument to fetchData";
})();

// 💪Challenge 06: Typing a Function Composition with Overloads and Generics
export function compose<T1, T2, T3, T4, T5>(
  fun1: (t: T1) => T2,
  fun2: (t: T2) => T3,
  fun3: (t: T3) => T4,
  fun4: (t: T4) => T5
): (t: T1) => T5;
export function compose<T1, T2, T3, T4>(
  fun1: (t: T1) => T2,
  fun2: (t: T2) => T3,
  fun3: (t: T3) => T4
): (t: T1) => T4;
export function compose<T1, T2, T3>(
  fun1: (t: T1) => T2,
  fun2: (t: T2) => T3
): (t: T1) => T2;
export function compose<T1, T2>(fun1: (t: T1) => T2): (t: T1) => T2;
export function compose(...funcs: Array<(input: any) => any>) {
  return (input: any) => {
    return funcs.reduce((acc, fn) => fn(acc), input);
  };
}

const addOne = (num: number) => {
  return num + 1;
};

const addTwoAndStringify = compose(addOne, addOne, String);

const result = addTwoAndStringify(4);

/**
 * addOne takes in a number - so it shouldn't be allowed after
 * a function that returns a string!
 */
const stringifyThenAddOne = compose(
  // @ts-expect-error
  String,
  addOne
);

// 💪Challenge 07: Build an Internationalization Library
type GetParamKeys<TTranslation extends string> = TTranslation extends ""
  ? []
  : TTranslation extends `${string}{${infer Param}}${infer Tail}`
    ? [Param, ...GetParamKeys<Tail>]
    : [];

const translate = <
  TTranslations extends Record<string, string>,
  TKey extends keyof TTranslations,
  TParamKeys extends GetParamKeys<TTranslations[TKey]>,
>(
  translations: TTranslations,
  key: TKey,
  ...args: TParamKeys extends []
    ? []
    : [values: Record<TParamKeys[number], string>]
) => {
  const translation = translations[key];
  const params: any = args[0] || {};

  return translation.replace(/{(\w+)}/g, (_, key) => params[key]);
};

const translations = {
  title: "Hello, {name}!",
  subtitle: "You have {count} unread messages.",
  button: "Click me!",
} as const;

const buttonText = translate(translations, "button");

const subtitle = translate(translations, "subtitle", {
  count: "2",
});

// 👉 "Should force you to provide parameters if required
// @ts-expect-error
translate(translations, "title");

// 👉 "Should not let you pass parameters if NOT required"
// @ts-expect-error
translate(translations, "button", {});
