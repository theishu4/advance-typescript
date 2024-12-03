// 🪶Note 18: Create Functions that Return Types
type ReturnWhatIPassIn<T> = T;
type Test = ReturnWhatIPassIn<"Ishu">;

type Maybe<T> = T | null | undefined;
type Test2 = Maybe<string>;

// 🪶Note 19: Ensure Type Safety in a Type Helper
type AddRoutePrefix<TRoute extends string> = `/${TRoute}`;

type Resolve = AddRoutePrefix<"home">;
// @ts-expect-error ❌
type GiveError = AddRoutePrefix<boolean>;

// 🪶Note 20: Create Type Helper with multiple parameter
type CreateDataShape<D, T> = {
  data: D;
  error: T;
};

type Test3 = CreateDataShape<string, TypeError>;

// 🪶Note 21: Optional Type Parameters with default type
type OptionalType<D, E extends Error = Error> = {
  data: D;
  error: E;
};

type WithDefault = OptionalType<string>;
type WithoutDefault = OptionalType<string, SyntaxError>;

// 🪶Note 22: Functions as Constraints for Type Helpers
type GetParametersAndReturnType<T extends (...args: any) => any> = {
  params: Parameters<T>;
  returnValue: ReturnType<T>;
};

type ParametersAndReturn = GetParametersAndReturnType<
  (username: string) => void
>;

// 🪶Note 23: Constraining Types for Anything but null or undefined
// 👇 In TS, `{}` is a broad type that accepts almost any value except null and undefined.
export type AnyTypeExpectNullable<T extends {}> = T | null | undefined;

type PassingNonNullable = AnyTypeExpectNullable<string>;

// @ts-expect-error ❌
type PassingNullable = AnyTypeExpectNullable<null>;

// 🪶Note 24: Constraining Type Helpers to Non Empty Arrays
type NonEmptyArray<T> = [T, ...T[]];
export const makeEnum = (values: NonEmptyArray<string>) => {};

makeEnum(["a"]);
makeEnum(["a", "b", "c"]);

// @ts-expect-error ❌
makeEnum([]);
