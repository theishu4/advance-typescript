// 🪶Note 26: What is a Function Overload
function returnWhatIPassIn(t: "matt"): "matt";
function returnWhatIPassIn(t: 1): 1;
function returnWhatIPassIn(t: "matt" | 1) {
  return t;
}

const returnOne = returnWhatIPassIn(1);
const returnMatt = returnWhatIPassIn("matt");

// 🪶Note 27: Function Overloads vs Conditional Types
function youSayGoodbyeISayHello(greeting: "goodbye"): "hello";
function youSayGoodbyeISayHello(greeting: "hello"): "goodbye";
function youSayGoodbyeISayHello(greeting: "goodbye" | "hello") {
  return greeting === "goodbye" ? "hello" : "goodbye";
}

const returnHello = youSayGoodbyeISayHello("hello");

const returnGoodbye = youSayGoodbyeISayHello("goodbye");

// 💎 Signature of function implementation doesn't expose to the outside the function.

// 🪶Note 28: Debugging Overloaded Functions
interface AnonymousPrivileges {
  sitesCanVisit: string[];
}

interface UserPrivileges extends AnonymousPrivileges {
  sitesCanEdit: string[];
}

interface AdminPrivileges extends UserPrivileges {
  sitesCanDelete: string[];
}

function getRolePrivileges(role: "admin"): AdminPrivileges;
function getRolePrivileges(role: "user"): UserPrivileges;
function getRolePrivileges(role: string): AnonymousPrivileges;
function getRolePrivileges(
  role: string
): AnonymousPrivileges | UserPrivileges | AdminPrivileges {
  switch (role) {
    case "admin":
      return {
        sitesCanDelete: [],
        sitesCanEdit: [],
        sitesCanVisit: [],
      };
    case "user":
      return {
        sitesCanEdit: [],
        sitesCanVisit: [],
      };
    default:
      return {
        sitesCanVisit: [],
      };
  }
}

const adminPrivileges = getRolePrivileges("admin");

const userPrivileges = getRolePrivileges("user");
const anonymousPrivileges = getRolePrivileges("Ishu");

// 🪶Note 29: Function Overloads vs Union Types
function runGenerator(
  generator: ((...args: any[]) => string) | { run: (...args: any[]) => string }
) {
  if (typeof generator === "function") {
    return generator();
  }
  return generator.run();
}

const passingObj = runGenerator({
  run: () => "hello",
});

const passingFun = runGenerator(() => "hello");

// 💎 Use function overload when returning different output on different input.

// 🪶Note 30: Generics in Function Overloads
function returnWhatIPassInExceptFor1(t: 1): 2;
function returnWhatIPassInExceptFor1<T>(t: T): T;
function returnWhatIPassInExceptFor1<T>(t: T | 1): T | 2 {
  if (t === 1) {
    return 2;
  }
  return t;
}

const return2 = returnWhatIPassInExceptFor1(1);

const a = returnWhatIPassInExceptFor1("a");
const b = returnWhatIPassInExceptFor1("b");
const c = returnWhatIPassInExceptFor1("c");

// 🪶Note 31: Solving an Inference Mystery
const divElement = document.querySelector("div");
const spanElement = document.querySelector("span");

/**
 * Your challenge: figure out why divElement2 is NOT
 * of type HTMLDivElement.
 */
const divElement2 = document.querySelector<HTMLDivElement>("div.foo");

// 🪶Note 32: Use Function Overloads to Infer Initial Data
function useData<T>(params: { fetchData: () => Promise<T> }): {
  getData: () => T | undefined;
};
function useData<T>(params: { fetchData: () => Promise<T>; initialData: T }): {
  getData: () => T;
};
function useData<T>(params: { fetchData: () => Promise<T>; initialData?: T }): {
  getData: () => T | undefined;
} {
  let data = params.initialData;

  params.fetchData().then((d) => {
    data = d;
  });

  return {
    getData: () => data,
  };
}

const withoutInitialData = useData({
  fetchData: () => Promise.resolve(1),
});

const numOrUndefined = withoutInitialData.getData();

const withInitialData = useData({
  fetchData: () => Promise.resolve(1),
  initialData: 2,
});

const num = withInitialData.getData();

// 🪶Note 33: The Instantiated with Subtype Error
const obj = {
  a: 1,
  b: 2,
  c: 3,
} as const;

type ObjKey = keyof typeof obj;

function getObjValue(): 1;
function getObjValue<TKey extends ObjKey>(key: TKey): (typeof obj)[TKey];
function getObjValue(key: ObjKey = "a") {
  return obj[key];
}

const one = getObjValue("a");
const oneByDefault = getObjValue();
const two = getObjValue("b");
const three = getObjValue("c");
