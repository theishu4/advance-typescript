type MyEvent =
  | {
      type: "click";
      event: MouseEvent;
    }
  | {
      type: "focus";
      event: FocusEvent;
    }
  | {
      type: "keydown";
      event: KeyboardEvent;
    };

// 🪶Note 5: Extract from a union
// 👉 It filter from union of Type A which extends second arg.
type ExtractMouseEvent = Extract<MyEvent, { type: "click" }>;

// 🪶Note 6: Exclude from a union
type ExcludeMouseEvent = Exclude<MyEvent, { type: "click" }>;

// 🪶Note 7: Index Access
const fakeDataDefaults = {
  String: "Default string",
  Int: 1,
  Float: 1.14,
  Boolean: true,
  obj: {
    String: "This is string",
  },
};

type FakeDataDefaults = typeof fakeDataDefaults;

type StringType = FakeDataDefaults["String"];
// type StringType = FakeDataDefaults.String;  ❌ Wrong
type IntType = (typeof fakeDataDefaults)["Int"];
type FloatType = FakeDataDefaults["Float"];
type BooleanType = FakeDataDefaults["Boolean"];
// 👉 You can make it nested
type ObjStringType = FakeDataDefaults["obj"]["String"];

// 🪶Note 8: Discriminated union to discriminator
// 👇 We can access it as long as they belong to each member in a union.
type EventType = MyEvent["type"];

// 🪶Note 9: Extract specific member from a union with index access.
const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;

// Method 01:
type ProgramModeEnumMap = typeof programModeEnumMap;
type IndividualProgram = ProgramModeEnumMap[
  | "ONE_ON_ONE"
  | "SELF_DIRECTED"
  | "PLANNED_ONE_ON_ONE"
  | "PLANNED_SELF_DIRECTED"];

// Method 02:
type IndividualProgram2 = ProgramModeEnumMap[Exclude<
  keyof ProgramModeEnumMap,
  "GROUP" | "ANNOUNCEMENT"
>];

// 🪶Note 10: Get All of an object value.
type AllValues = ProgramModeEnumMap[keyof ProgramModeEnumMap];

// 🪶Note 11: Create Union out of array values
const fruits = ["apple", "banana", "orange"] as const;

type AppleOrBanana = Exclude<(typeof fruits)[number], "orange">;
type Fruit = (typeof fruits)[number];

// 🪶Note 12: Extract type of element of an array
const animals = ["dogs", "parrot", "lion"];
type AnimalElementType = (typeof animals)[number];
