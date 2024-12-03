import { Split } from "ts-toolbelt/out/String/Split";

// 💪Challenge 01: Transform Dynamic Path Parameters from Strings to Objects
type UserPath = "/users/:id";

type UserOrganizationPath = "/users/:id/organizations/:organizationId";

type ExtractPathParams<T extends string> = {
  [K in Split<T, "/">[number] as K extends `:${infer Param}`
    ? Param
    : never]: string;
};

type ReturnId = ExtractPathParams<UserPath>;
type ReturnIdAndOrganizationId = ExtractPathParams<UserOrganizationPath>;

// 💪Challenge 02: Transform an Object into a Discriminated Union
interface Attributes {
  id: string;
  email: string;
  username: string;
}

/**
 * How do we create a type helper that represents a union
 * of all possible combinations of Attributes?
 */
// Method 01:
type MutuallyExclusive<T extends {}> = {
  [K in keyof T]: {
    [Key in keyof T as Extract<Key, K>]: T[Key];
  };
}[keyof T];

type ExclusiveAttributes = MutuallyExclusive<Attributes>;

// Method 02:
type MutuallyExclusiveUsingRecord<T> = {
  [K in keyof T]: Record<K, T[K]>;
}[keyof T];

type ExclusiveAttributesUsingRecord = MutuallyExclusiveUsingRecord<Attributes>;

// 💪Challenge 03: Transform a Discriminated Union with Unique Values to an Object
type Route =
  | {
      route: "/";
      search: {
        page: string;
        perPage: string;
      };
    }
  | { route: "/about" }
  | { route: "/admin" }
  | { route: "/admin/users" };

type RoutesObject = {
  [R in Route as R["route"]]: R extends { search: infer S } ? S : never;
};

// 💪Challenge 04: Construct a Deep Partial of an Object
type DeepPartial<T> =
  T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : {
        [K in keyof T]?: DeepPartial<T[K]>;
      };

type MyType = {
  a: string;
  b: number;
  c: {
    d: string;
    e: {
      f: string;
      g: {
        h: string;
        i: string;
      }[];
    };
  };
};

type Test1 = {
  a: [
    {
      b: string;
      c: boolean;
    },
  ];
};
type Result2 = DeepPartial<Test1>;
type Result = DeepPartial<MyType>;
