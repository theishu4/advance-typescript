import { ChangeEventHandler, useState } from "react";
import { it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";
import { createUser } from "fake-external-lib";

// 🪶Note 01: DRY out Code with Generic Type Helpers
type Icon = "home" | "settings" | "about";
type ButtonVariant = "primary" | "secondary" | "tertiary";

// How do we refactor this to make it DRY?
type LooseAutoComplete<T> = T | (string & {});
type LooseIcon = LooseAutoComplete<Icon>;
type LooseButtonVariant = LooseAutoComplete<ButtonVariant>;

export const icons: LooseIcon[] = [
  "home",
  "settings",
  "about",
  "any-other-string",
  // I should get autocomplete if I add a new item here!
];

export const buttonVariants: LooseButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "any-other-string",
  // I should get autocomplete if I add a new item here!
];

// 🪶Note 02: Creating an All or Nothing Type Helper for React props
// Method 01:
type AllOrNothing<T extends object> = T | { [K in keyof T]?: undefined };

// Method 02:
type AllOrNothing2<T extends object> = T | Partial<Record<keyof T, undefined>>;

export type InputProps = AllOrNothing<{
  value: string;
  onChange: ChangeEventHandler;
}> & {
  label: string;
};

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div>
      <label>
        {label}
        <input {...props} />
      </label>
    </div>
  );
};

export const Test = () => {
  return (
    <div>
      <Input label="Greeting" value="Hello" onChange={() => {}} />
      <Input label="Greeting" />

      {/* @ts-expect-error */}
      <Input label="Greeting" value="Hello" />

      {/* @ts-expect-error */}
      <Input label="Greeting" onChange={() => {}} />
    </div>
  );
};

// 🪶Note 03: Adding Type Arguments to a Hook
export const useLocalStorage = <T,>(prefix: string) => {
  return {
    get: (key: string): T | null => {
      return JSON.parse(window.localStorage.getItem(prefix + key) || "null");
    },
    set: (key: string, value: T) => {
      window.localStorage.setItem(prefix + key, JSON.stringify(value));
    },
  };
};

const user = useLocalStorage<{ name: string }>("user");

it("Should let you set and get values", () => {
  user.set("matt", { name: "Matt" });

  const mattUser = user.get("matt");

  type tests = [Expect<Equal<typeof mattUser, { name: string } | null>>];
});

it("Should not let you set a value that is not the same type as the type argument passed", () => {
  user.set(
    "something",
    // @ts-expect-error
    {}
  );
});

// 🪶Note 04: Wrapping a Generic Function Inside of Another
export const useStateAsObject = <S,>(initial: S) => {
  const [value, set] = useState(initial);

  return {
    value,
    set,
  };
};

const example = useStateAsObject({ name: "Matt" });

type ExampleTests = [
  Expect<Equal<typeof example.value, { name: string }>>,
  Expect<
    Equal<
      typeof example.set,
      React.Dispatch<React.SetStateAction<{ name: string }>>
    >
  >
];

const num = useStateAsObject(2);

type NumTests = [
  Expect<Equal<typeof num.value, number>>,
  Expect<Equal<typeof num.set, React.Dispatch<React.SetStateAction<number>>>>
];

// 🪶Note 05: Applying Generics to Components
interface TableProps<T> {
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
}

export const Table = <T,>(props: TableProps<T>) => {
  return (
    <table>
      <tbody>
        {props.rows.map((row) => (
          <tr>{props.renderRow(row)}</tr>
        ))}
      </tbody>
    </table>
  );
};

const data = [
  {
    id: 1,
    name: "John",
  },
];

export const Parent = () => {
  return (
    <div>
      <Table rows={data} renderRow={(row) => <td>{row.name}</td>} />
      <Table
        rows={data}
        renderRow={(row) => {
          type test = Expect<Equal<typeof row, { id: number; name: string }>>;
          return (
            <td>
              {
                // @ts-expect-error
                row.doesNotExist
              }
            </td>
          );
        }}
      ></Table>
    </div>
  );
};

// 🪶Note 06: Generics in Class Components
export class TableComponent<T> extends React.Component<TableProps<T>> {
  render(): React.ReactNode {
    return (
      <table>
        <tbody>
          {this.props.rows.map((row) => (
            <tr>{this.props.renderRow(row)}</tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export const Parent2 = () => {
  return (
    <div>
      <TableComponent rows={data} renderRow={(row) => <td>{row.name}</td>} />
      <TableComponent
        rows={data}
        renderRow={(row) => {
          type test = Expect<Equal<typeof row, { id: number; name: string }>>;
          return (
            <td>
              {
                // @ts-expect-error
                row.doesNotExist
              }
            </td>
          );
        }}
      ></TableComponent>
    </div>
  );
};

// 🪶Note 07: Passing Type Arguments To Components
interface User {
  id: number;
  name: string;
  age: number;
}

<>
  <Table<User>
    // @ts-expect-error rows should be User[]
    rows={[1, 2, 3]}
    renderRow={(row) => {
      type test = Expect<Equal<typeof row, User>>;
      return <td>{row.name}</td>;
    }}
  />
  <Table<User>
    rows={[
      {
        id: 1,
        name: "John",
        age: 30,
      },
      {
        // @ts-expect-error id should be string
        id: "2",
        name: "Jane",
        age: 30,
      },
    ]}
    renderRow={(row) => {
      type test = Expect<Equal<typeof row, User>>;
      return <td>{row.name}</td>;
    }}
  ></Table>
</>;

// 🪶Note 08: Generic Inference through Multiple Type Helpers
interface Button<V> {
  value: V;
  label: string;
}

interface ButtonGroupProps<V> {
  buttons: Button<V>[];
  onClick: (value: V) => void;
}

const ButtonGroup = <V extends string>(props: ButtonGroupProps<V>) => {
  return (
    <div>
      {props.buttons.map((button) => {
        return (
          <button
            key={button.value}
            onClick={() => {
              props.onClick(button.value);
            }}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
};

<>
  <ButtonGroup
    onClick={(value) => {
      type test = Expect<Equal<typeof value, "add" | "delete">>;
    }}
    buttons={[
      {
        value: "add",
        label: "Add",
      },
      {
        value: "delete",
        label: "Delete",
      },
    ]}
  ></ButtonGroup>
</>;

// 🪶Note 09: Build a useMutation hook
type Mutation<T, R> = (...args: T[]) => Promise<R>;

interface UseMutationReturn<T, R> {
  mutate: Mutation<T, R>;
  isLoading: boolean;
}

interface UseMutationOptions<T, R> {
  mutation: Mutation<T, R>;
}

export const useMutation = <T, R>(
  opts: UseMutationOptions<T, R>
): UseMutationReturn<T, R> => {
  const [isLoading, setIsLoading] = useState(false);

  return {
    mutate: async (...args) => {
      setIsLoading(true);

      try {
        const result = await opts.mutation(...args);
        return result;
      } catch (e) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
};

const mutation = useMutation({
  mutation: createUser,
});

mutation.mutate({ name: "John Doe", email: "john@doe.com" });

// @ts-expect-error email missing!
mutation.mutate({ name: "John Doe" });

mutation.mutate(
  {
    name: "John Doe",
    email: "john@doe.com",
  },
  {
    throwOnError: true,
    // @ts-expect-error extra prop
    extra: "oh dear",
  }
);

type test = [
  Expect<Equal<typeof mutation.isLoading, boolean>>,
  Expect<
    Equal<
      typeof mutation.mutate,
      (
        user: { name: string; email: string },
        opts?: {
          throwOnError?: boolean;
        }
      ) => Promise<{
        id: string;
        name: string;
        email: string;
      }>
    >
  >
];
