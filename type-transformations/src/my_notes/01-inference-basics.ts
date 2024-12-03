// 🪶Note 1: ReturnType<> and Parameters<>
const myFunc = (firstName: string, lastName: string) => {
  return `Hello ${firstName + " " + lastName}`;
};

type MyFunc = typeof myFunc;
export type MyFuncReturn = ReturnType<MyFunc>;

type MyParameterType = Parameters<MyFunc>;

// 🪶Note 2: Extracting type from tuples
export type ParameterSecondArgument = MyParameterType[1];

// 🪶Note 3: `Awaited<>`: Extract a Promise result
const getUser = () => {
  return Promise.resolve({
    id: 123,
    name: "Ishu Modanwal",
    email: "theishu4@gmail.com",
  });
};

export type PromiseReturnValue = Awaited<ReturnType<typeof getUser>>;

// 🪶Note 4: Create a Union type from an Object keys
const testingFrameworks = {
  vitest: {
    label: "Vitest",
  },
  jest: {
    label: "Jest",
  },
  mocha: {
    label: "Mocha",
  },
};

export type KeyOfTestingFrameworks = keyof typeof testingFrameworks;
