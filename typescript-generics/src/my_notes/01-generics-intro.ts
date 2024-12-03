// 🪶Note 01: Typing function: Return what I pass in
const returnWhatIPassIn = <T>(param: T) => {
  return param;
};

const one = returnWhatIPassIn(1);
const matt = returnWhatIPassIn("matt");

// 🪶Note 02: Restricting Type using Generics Constraints
export const passOnlyString = <T extends string>(t: T) => t;

passOnlyString("string");

// @ts-expect-error
passOnlyString(1);

// @ts-expect-error
passOnlyString(true);

// @ts-expect-error
passOnlyString({
  foo: "bar",
});

// 🪶Note 03: Multiple Type Parameters
const returnBothOfWhatIPassIn = <A, B>(a: A, b: B) => {
  return {
    a,
    b,
  };
};

const stringAndBoolean = returnBothOfWhatIPassIn("Ishu", true);
const numberAndObject = returnBothOfWhatIPassIn(4, { name: "Ishu" });

// ❓What to return exact form:
const returnBothOfWhatIPassInTight = <A extends string, B extends number>(
  a: A,
  b: B
) => {
  return {
    a,
    b,
  };
};

const ishuAnd21 = returnBothOfWhatIPassInTight("Ishu", 21);

// 🪶Note 04: Approaches for Typing Object Parameters
const returnPassesObject = <A, B>(params: { a: A; b: B }) => {
  return {
    first: params.a,
    second: params.b,
  };
};

const numberAndString = returnPassesObject({
  a: 3,
  b: "Hello, Typescript",
});

// 🪶Note 05: Generics in Classes
export class Component<T> {
  private username: T;

  constructor(name: T) {
    this.username = name;
  }

  getName = () => this.username;
}

const getString = new Component("Ishu").getName();
const getObject = new Component({
  a: 1,
  b: true,
  c: "Hello, World!",
}).getName();

// 🪶Note 06: Generic Mapper Function
export const concatenateFirstNameAndLastName = <
  T extends { firstName: string; lastName: string },
>(
  user: T
) => {
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  };
};

const defaultObject = concatenateFirstNameAndLastName({
  firstName: "Ishu",
  lastName: "Modanwal",
});
const defaultAndAge = concatenateFirstNameAndLastName({
  firstName: "Shruti",
  lastName: "Jaiswal",
  age: 22,
});
