import { expect, it } from "vitest";
import { Expect, Equal } from "../helpers/type-utils";

declare const brand: unique symbol;
type Brand<T, TBrand> = T & { [brand]: TBrand };

// 🪶Note 01: What is a Branded type?
type Password = Brand<string, "Password">;
type Email = Brand<string, "Email">;

type UserObject = Brand<
  {
    id: string;
    name: string;
  },
  "User"
>;

const user: UserObject = {
  id: "123",
  name: "Ishu Modanwal",
} as UserObject;

const verifyPassword = (password: Password) => {};

const password = "1231423" as Password;

const email = "mpocock@me.com" as Email;

let passwordSlot: Password;

passwordSlot = "iLoveYou" as Password;

// 🪶Note 02: Form Validation with Branded Types
export const validateValues = (values: { email: string; password: string }) => {
  if (!values.email.includes("@")) {
    throw new Error("Email invalid");
  }
  if (values.password.length < 8) {
    throw new Error("Password not long enough");
  }

  return {
    email: values.email as Email,
    password: values.password as Password,
  };
};

const createUserOnApi = (values: { email: Email; password: Password }) => {
  // Imagine this function creates the user on the API
};

const onSubmitHandler = (values: { email: string; password: string }) => {
  const validatedValues = validateValues(values);
  // How do we stop this erroring?
  createUserOnApi(validatedValues);
};

expect(() => {
  onSubmitHandler({
    email: "invalid",
    password: "12345678",
  });
}).toThrowError("Email invalid");

expect(() => {
  onSubmitHandler({
    email: "whatever@example.com",
    password: "1234567",
  });
}).toThrowError("Password not long enough");

// 🪶Note 03: Using Branded Types as Entity Ids
type UserId = Brand<string, "UserId">;
type PostId = Brand<string, "PostId">;

interface User {
  id: UserId;
  name: string;
}

interface Post {
  id: PostId;
  title: string;
  content: string;
}

const db: { users: User[]; posts: Post[] } = {
  users: [
    {
      id: "1" as UserId,
      name: "Miles",
    },
  ],
  posts: [
    {
      id: "1" as PostId,
      title: "Hello world",
      content: "This is my first post",
    },
  ],
};

const getUserById = (id: UserId) => {
  return db.users.find((user) => user.id === id);
};

const getPostById = (id: PostId) => {
  return db.posts.find((post) => post.id === id);
};

const postId = "1" as PostId;
// @ts-expect-error: Should only let you get a user by id with a user id
getUserById(postId);

const userId = "1" as UserId;
// @ts-expect-error: Should only let you get a post by id with a PostId
getPostById(userId);

// 🪶Note 04: Creating Reusable Validity Checks with Branded Types and Type Helpers
type Valid<T> = Brand<T, "Valid">;

interface PasswordValues {
  password: string;
  confirmPassword: string;
}

const validatePassword = (values: PasswordValues) => {
  if (values.password !== values.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  return values;
};

const createUserByApi = (values: Valid<PasswordValues>) => {
  // Imagine this function creates the user on the API
};

const onSubmitWithoutValidating = (values: PasswordValues) => {
  // @ts-expect-error: Should fail if you do not validate the values before calling createUserByApi
  createUserByApi(values);
};

const onSubmitWithValidation = (values: PasswordValues) => {
  const validatedValues = validatePassword(values) as Valid<PasswordValues>;
  createUserByApi(validatedValues);
};

// 🪶Note 05: Creating Validation Boundaries with Branded Types
interface TUser {
  id: string;
  name: string;
  maxConversionAmount: number;
}

type ConvertedAmount = Brand<number, "ConvertedAmount">;
type AuthorizedUser = Brand<TUser, "AuthorizedUser">;

// Mocks a function that uses an API to convert
// One currency to another
const getConversionRateFromApi = async (
  amount: number,
  from: string,
  to: string
) => {
  return Promise.resolve((amount * 0.82) as ConvertedAmount);
};

// Mocks a function which actually performs the conversion
const performConversion = async (
  user: AuthorizedUser,
  to: string,
  amount: ConvertedAmount
) => {};

const ensureUserCanConvert = (user: TUser, amount: ConvertedAmount) => {
  if (user.maxConversionAmount < amount) {
    throw new Error("User cannot convert currency");
  }

  return user as AuthorizedUser;
};

it("Should error if you do not authorize the user first", () => {
  const handleConversionRequest = async (
    user: TUser,
    from: string,
    to: string,
    amount: number
  ) => {
    const convertedAmount = await getConversionRateFromApi(amount, from, to);

    // @ts-expect-error
    await performConversion(user, to, convertedAmount);
  };
});

it("Should error if you do not convert the amount first", () => {
  const handleConversionRequest = async (
    user: TUser,
    from: string,
    to: string,
    amount: number
  ) => {
    // @ts-expect-error
    const authorizedUser = ensureUserCanConvert(user, amount);

    // @ts-expect-error
    await performConversion(authorizedUser, to, amount);
  };
});

it("Should pass type checking if you authorize the user AND convert the amount", () => {
  const handleConversionRequest = async (
    user: TUser,
    from: string,
    to: string,
    amount: number
  ) => {
    const convertedAmount = await getConversionRateFromApi(amount, from, to);
    const authorizedUser = ensureUserCanConvert(user, convertedAmount);

    await performConversion(authorizedUser, to, convertedAmount);
  };
});

// 🪶Note 06: Using Index Signatures with Branded Types
type PostID = Brand<string, "PostID">;
type UserID = Brand<string, "UserID">;

interface IUser {
  id: UserID;
  name: string;
}

interface IPost {
  id: PostID;
  title: string;
}

/**
 * Change this type definition! We should be able to
 * add users and posts to the db by their id.
 *
 * You'll need an index signature of some kind - or maybe
 * two!
 */

const database: { [postId: PostID]: IPost; [userId: UserID]: IUser } = {};

it("Should let you add users and posts to the database by their id", () => {
  const postId = "post_1" as PostID;
  const userId = "user_1" as UserID;

  database[postId] = {
    id: postId,
    title: "Hello world",
  };

  database[userId] = {
    id: userId,
    name: "Miles",
  };

  const test = () => {
    // Code slightly updated since video was recorded, see
    // https://gist.github.com/mattpocock/ac5bc4eabcb95c05d5d106ccb73c84cc
    const post = database[postId];
    const user = database[userId];

    type tests = [
      Expect<Equal<typeof post, IPost>>,
      Expect<Equal<typeof user, IUser>>,
    ];
  };
});

it("Should fail if you try to add a user under a post id", () => {
  const postId = "post_1" as PostID;
  const userId = "user_1" as UserID;

  const user: IUser = {
    id: userId,
    name: "Miles",
  };

  // @ts-expect-error
  database[postId] = user;
});
