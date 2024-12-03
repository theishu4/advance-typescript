// 🪶Note 11: Generics at Different Levels
// Method 01:
export const getHomePageFeatureFlags0 = <
  TConfig extends {
    rawConfig: {
      featureFlags: {
        homePage: any;
      };
    };
  },
>(
  config: TConfig,
  override: (
    flags: TConfig["rawConfig"]["featureFlags"]["homePage"]
  ) => TConfig["rawConfig"]["featureFlags"]["homePage"]
) => {
  return override(config.rawConfig.featureFlags.homePage);
};

// Method 02: (Recommend)
export const getHomePageFeatureFlags = <HomePageFlag>(
  config: {
    rawConfig: {
      featureFlags: { homePage: HomePageFlag };
    };
  },
  override: (flags: HomePageFlag) => HomePageFlag
) => {
  return override(config.rawConfig.featureFlags.homePage);
};

const EXAMPLE_CONFIG = {
  apiEndpoint: "https://api.example.com",
  apiVersion: "v1",
  apiKey: "1234567890",
  rawConfig: {
    featureFlags: {
      homePage: {
        showBanner: true,
        showLogOut: false,
      },
      loginPage: {
        showCaptcha: true,
        showConfirmPassword: false,
      },
    },
  },
};

const flags1 = getHomePageFeatureFlags(
  EXAMPLE_CONFIG,
  (defaultFlags) => defaultFlags
);

const flags2 = getHomePageFeatureFlags(EXAMPLE_CONFIG, (defaultFlags) => ({
  ...defaultFlags,
  showBanner: false,
}));

// 🪶Note 12: Typed Object Keys
// Method 01:
const typedObjectKeysHigh = <T extends object>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

const result1 = typedObjectKeysHigh({
  a: 1,
  b: 2,
});

// Method 02:
const typedObjectKeysLow = <T extends string>(obj: Record<T, any>) => {
  return Object.keys(obj) as Array<T>;
};

const result2 = typedObjectKeysLow({
  a: 1,
  b: 2,
});

// 🪶Note 13: Understand Literal Inference in Generics
// When returning the value only, it infers the literal type
const returnsValueOnly = <T>(t: T) => {
  return t;
};

const test = returnsValueOnly("a");
//    ^?

// When returning an object or array, it doesn't infer the literal type
const returnsValueInAnObject = <T1>(t: T1) => {
  return {
    t,
  };
};

const test2 = returnsValueInAnObject("abc");
//    ^?

// With a constraint, it narrows it to its literal
const returnsValueInAnObjectWithConstraint = <T1 extends string>(t: T1) => {
  return {
    t,
  };
};

const test3 = returnsValueInAnObjectWithConstraint("abc");
//    ^?

// 🪶Note 14: Understand Generic Inference When Using Objects as Arguments
// When returning the value only, it infers
// the literal type
const acceptsValueOnly = <T>(t: T) => {
  return t;
};

const inferLiteral = acceptsValueOnly("a");
//    ^?

const acceptsValueInAnObject = <T>(obj: { input: T }) => {
  return obj.input;
};

const inferString = acceptsValueInAnObject({ input: "abc" });
//    ^?

const inferLiteralOnAsConst = acceptsValueInAnObject({ input: "abc" } as const);
//    ^?

const acceptsValueInAnObjectFieldWithConstraint = <T extends string>(obj: {
  input: T;
}) => {
  return obj.input;
};

const inferLiteralOnConstraint = acceptsValueInAnObjectFieldWithConstraint({
  input: "abc",
});
//    ^?

const acceptsValueWithObjectConstraint = <
  T extends {
    input: string;
  },
>(
  obj: T
) => {
  return obj.input;
};

const inferStringOnObjConstraint = acceptsValueWithObjectConstraint({
  input: "abc",
});

const inferStringEvenOnAsConst = acceptsValueWithObjectConstraint({
  input: "abc",
} as const);

// 🪶Note 15: Inferring Literal Types from any Basic Type
export const inferItemLiteral = <T extends string | number>(t: T) => {
  return {
    output: t,
  };
};

const returnA = inferItemLiteral("a");
const return123 = inferItemLiteral(123);

// 🪶Note 16: Infer the Type of an Array Member
const makeStatus = <T extends string>(statuses: T[]) => {
  return statuses;
};

const statuses = makeStatus(["INFO", "DEBUG", "ERROR", "WARNING"]);

// 🪶Note 17: Generics in a Class Names Creator
const createClassNamesFactory =
  <T extends string>(classes: Record<T, string>) =>
  (type: T, ...otherClasses: string[]) => {
    const classList = [classes[type], ...otherClasses];
    return classList.join(" ");
  };

const getBg = createClassNamesFactory({
  primary: "bg-blue-500",
  secondary: "bg-gray-500",
});

const primaryBg = getBg("primary"); // bg-blue-500
const secondaryBg = getBg("secondary"); // bg-gray-500
const joinClasses = getBg("primary", "text-white", "rounded", "p-4"); // bg-blue-500 text-white rounded p-4

// @ts-expect-error
getBg([]);

// @ts-expect-error
getBg("tertiary");
