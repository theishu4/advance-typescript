import { T } from "ts-toolbelt";
import { Split } from "ts-toolbelt/out/String/Split";

// 🪶Note 25: Add Conditional Logic to a Type Helper
type YouSayGoodbyeAndISayHello<T extends string> = T extends "hello"
  ? "goodbye"
  : "hello";

type SayHello = YouSayGoodbyeAndISayHello<"iAmIshu">;
type SayGoodbye = YouSayGoodbyeAndISayHello<"hello">;

// 🪶Note 26: Nested logic in a Type Helper
type GoodbyeOrHelloOrNever<T> = T extends "hello"
  ? "goodbye"
  : T extends "goodbye"
    ? "hello"
    : never;

type HelloType = GoodbyeOrHelloOrNever<"goodbye">;
type GoodbyeType = GoodbyeOrHelloOrNever<"hello">;
type NeverType = GoodbyeOrHelloOrNever<"ishu">;

// 🪶Note 27: Inferring Elements Inside a Conditional with Infer
// Method 01: Using Index
type GetDataValue<T> = T extends { data: any } ? T["data"] : never;

type DataAsString = GetDataValue<{ data: string; id: number }>;
type WithoutData = GetDataValue<string>;

// Method 02: Using Infer
type GetDataByInfer<T> = T extends { data: infer TData } ? TData : never;

type DataAsObject = GetDataByInfer<{
  data: { username: "Ishu"; age: 20 };
  id: 123;
}>;

// 🪶Note 28: Extract Type Arguments to Another Type Helper
interface MyComplexInterface<Event, Context, Name, Point> {
  getEvent: () => Event;
  getContext: () => Context;
  getName: () => Name;
  getPoint: () => Point;
}

type Example = MyComplexInterface<
  "click",
  "window",
  "my-event",
  { x: 12; y: 14 }
>;

type GetPoint<T> =
  T extends MyComplexInterface<any, any, any, infer InferredPoint>
    ? InferredPoint
    : never;

type ReturnPoint = GetPoint<Example>;

// 🪶Note 29: Extract Parts of a String with a Template Literal
type GetSurname<T> = T extends `${string} ${infer SurnameType}`
  ? SurnameType
  : never;

type ReturnKohli = GetSurname<"Virat Kohli">;

// Just for practice using 'Split' type.
type GetSurnameUsingSplit<T extends `${string} ${string}`> = Split<T, " ">[1];

// 🪶Note 30: Extract the Result of an Async Function
const getServerSideProps = async () => {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const json: { title: string } = await data.json();
  return {
    props: {
      json,
    },
  };
};

// Method 01: Using Infer
type ReturnPropsUsingInfer<T> = T extends (...args: any) => Promise<{
  props: infer ReturnT;
}>
  ? ReturnT
  : never;

type GetPropsUsingInfer = ReturnPropsUsingInfer<typeof getServerSideProps>;

// Method 02: Using Index
type ReturnPropsUsingIndex<
  T extends (...args: any) => Promise<{ props: any }>,
> = Awaited<ReturnType<T>>["props"];

type GetPropsUsingIndex = ReturnPropsUsingIndex<typeof getServerSideProps>;

// 🪶Note 31: Extract the Result From Several Possible Function Shapes
const parser1 = {
  parse: () => 1,
};

const parser2 = () => "123";

const parser3 = {
  extract: () => true,
};

type GetParserResult<T> = T extends
  | { parse: () => infer ReturnT }
  | { extract: () => infer ReturnT }
  | (() => infer ReturnT)
  ? ReturnT
  : never;

type ExpectingNumber = GetParserResult<typeof parser1>;
type ExpectingString = GetParserResult<typeof parser2>;
type ExpectingBoolean = GetParserResult<typeof parser3>;

// 🪶Note 32: Distributivity in Conditional Types
type Fruit = "apple" | "banana" | "orange";

/**
 * 👉 Here it's returning `never` because it is comparing
 *  `Fruit` as a whole with `"apple"` | `"banana"`.
 */
type AppleOrBanana = Fruit extends "apple" | "banana" ? Fruit : never;

/**
 * 👉 If we plug a union type into Generic Type, then the
 *  conditional type will be applied to each member of that
 *  union.
 */
type AppleOrBananaGeneric<T> = T extends "apple" | "banana" ? T : never;

/**
 * 🤔 How is this working?
 * 
 * When we pass union type to `AppleOrBananaGeneric` it get
 * distributed like this...
 * 
 * ```typescript
 * | AppleOrBananaGeneric<"apple">
 * | AppleOrBananaGeneric<"banana">
 * | AppleOrBananaGeneric<"orange">
 *```

 * Read more at: {@link https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types Distributive Conditional Types}
 */
type ReturnAppleOrBanana = AppleOrBananaGeneric<Fruit>;
