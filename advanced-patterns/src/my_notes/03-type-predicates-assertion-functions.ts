import { it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";
import { Brand } from "../helpers/Brand";

// 🪶Note 11. Filtering with Type Predicates
export const values = ["a", "b", undefined, "c", undefined];

const filteredValues = values.filter((value): value is string => !!value); // ['a', 'b', 'c']

type returnArrayOfString = typeof filteredValues;

// 🪶Note 12. Checking Types with Assertion Functions
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  role: "admin";
  organizations: string[];
}

interface NormalUser extends User {
  role: "normal";
}

function assertUserIsAdmin(
  user: NormalUser | AdminUser
): asserts user is AdminUser {
  if (user.role !== "admin") {
    throw new Error("Not an admin user");
  }
}

const user: NormalUser = {
  id: "user_1",
  name: "Miles",
  role: "normal",
};
assertUserIsAdmin(user); // throw error

it("Should assert that the type is an admin user after it has been validated", () => {
  const example = (user: NormalUser | AdminUser) => {
    assertUserIsAdmin(user);

    type tests = [Expect<Equal<typeof user, AdminUser>>];
  };
});

// 🪶Note 13: Avoiding TypeScripts Most Confusing Error
// 💎 So always use function declaration while using type assertion
const ensureUserIsAdmin = (
  user: NormalUser | AdminUser
): asserts user is AdminUser => {
  if (user.role !== "admin") {
    throw new Error("Not an admin user");
  }
};

it("Should assert that the type is an admin user after it has been validated", () => {
  const example = (user: NormalUser | AdminUser) => {
    /**
     * Why is this error happening?
     * 🤔🤔🤔
     */
    // @ts-expect-error
    ensureUserIsAdmin(user);
    // @ts-expect-error
    type tests = [Expect<Equal<typeof user, AdminUser>>];
  };
});

// 🪶Note 14: Combining Type Predicates with Generics
/**
 * Go to --> src/03-type-predicates-assertion-functions/15-type-predicates-with-generics.problem.ts
 */

// 🪶Note 15: Combining Brands and Type Predicates
type Valid<T> = Brand<T, "Valid">;

interface PasswordValues {
  password: string;
  confirmPassword: string;
}

const isValidPassword = (
  values: PasswordValues
): values is Valid<PasswordValues> => {
  if (values.password !== values.confirmPassword) {
    return false;
  }
  return true;
};

const createUserOnApi = (values: Valid<PasswordValues>) => {
  // Imagine this function creates the user on the API
};

it("Should fail if you do not validate the values before calling createUserOnApi", () => {
  const onSubmitHandler = (values: PasswordValues) => {
    // @ts-expect-error
    createUserOnApi(values);
  };
});

it("Should succeed if you DO validate the values before calling createUserOnApi", () => {
  const onSubmitHandler = (values: PasswordValues) => {
    if (isValidPassword(values)) {
      createUserOnApi(values);
    }
  };
});

// 🪶Note 16: Combining Brands with Assertion Functions
function assertIsValidPassword(
  values: PasswordValues
): asserts values is Valid<PasswordValues> {
  if (values.password !== values.confirmPassword) {
    throw new Error("Password is invalid");
  }
}

it("Should fail if you do not validate the passwords before calling createUserOnApi", () => {
  const onSubmitHandler = (values: PasswordValues) => {
    // @ts-expect-error
    createUserOnApi(values);
  };
});

it("Should succeed if you DO validate the passwords before calling createUserOnApi", () => {
  const onSubmitHandler = (values: PasswordValues) => {
    assertIsValidPassword(values);
    createUserOnApi(values);
  };
});
