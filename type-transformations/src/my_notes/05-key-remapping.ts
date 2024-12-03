// 🪶Note 33: Map Over a Union to Create an Object
type Route = "/" | "/about" | "/admin" | "/admin/users";

type RoutesObject = {
  [R in Route]: R;
};

// 🪶Note 34: Mapped Types with Objects
interface Attributes {
  firstName: string;
  lastName: string;
  age: number;
}

type AttributeGetters = {
  readonly [K in keyof Attributes as `get${Capitalize<
    string & K
  >}`]: () => Attributes[K];
};

// 🪶Note 35: Conditionally Extract Properties from Object
interface Example {
  name: string;
  age: number;
  id: string;
  organizationId: string;
  groupId: string;
}

type SearchForId = `id` | `${string}Id`;
type OnlyIdKeys<T> = {
  [K in keyof T as K extends SearchForId ? K : never]: T[K];
};

type GetIds = OnlyIdKeys<Example>;

// 🪶Note 36: Map a Discriminated Union to an Object
type DiscriminatedRoute =
  | {
      route: "/";
      search: {
        page: string;
        perPage: string;
      };
    }
  | { route: "/about"; search: {} }
  | { route: "/admin"; search: {} }
  | { route: "/admin/users"; search: {} };

/**
 * **Method 01:**
 * This is useful, but less powerful than solution 2
 */
type RouteObjectUsingExtract = {
  [K in DiscriminatedRoute["route"]]: Extract<
    DiscriminatedRoute,
    { route: K }
  >["search"];
};

/**
 * **Method 02:**
 * Here, R represents the individual Route.
 *
 * The lesson here is that the thing we're iterating
 * **DOESN'T** have to be a `string` | `number` | `symbol`, as long
 * as the thing we cast it to is.
 */
type RouteObjectUsingIndex = {
  [R in DiscriminatedRoute as R["route"]]: R["search"];
};

// 🪶Note 37: Map an Object to a Union of Tuples
interface Values {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
}

type ValuesAsUnionOfTuples = {
  [K in keyof Values]: [K, Values[K]];
};

type TuplesOfValues = ValuesAsUnionOfTuples[keyof ValuesAsUnionOfTuples];

// 🪶Note 38: Transform an Object into a Union of Template Literals
interface FruitMap {
  apple: "red";
  banana: "yellow";
  orange: "orange";
}

// Method 01:
type TransformedFruit = {
  [K in keyof FruitMap]: `${K}:${FruitMap[K]}`;
}[keyof FruitMap];

// Method 02:
type TransformedFruit2 = keyof {
  [K in keyof FruitMap as `${K}:${FruitMap[K]}`]: K;
};

// 🪶Note 39: Transform a Discriminated Union into a Union
type DiscriminatedFruit =
  | {
      name: "apple";
      color: "red";
    }
  | {
      name: "banana";
      color: "yellow";
    }
  | {
      name: "orange";
      color: "orange";
    };

// Method 01:
type DiscriminatedUnionToUnion = {
  [F in DiscriminatedFruit["name"]]: `${F}:${Extract<
    DiscriminatedFruit,
    { name: F }
  >["color"]}`;
}[DiscriminatedFruit["name"]];

// Method 02:
type DiscriminatedUnionToUnion2 = {
  [F in DiscriminatedFruit as F["name"]]: `${F["name"]}:${F["color"]}`;
}[DiscriminatedFruit["name"]];
