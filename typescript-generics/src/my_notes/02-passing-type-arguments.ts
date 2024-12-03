// 🪶Note 07: Add Type Parameters to a Function
export const createSet = <T = string>() => {
  return new Set<T>();
};

const stringSet = createSet<string>();
const numberSet = createSet<number>();
const defaultStringSet = createSet();

// 🪶Note 08: Infer Types from Type Arguments
class Component<TProps> {
  private props: TProps;

  constructor(props: TProps) {
    this.props = props;
  }

  getProps = () => this.props;
}

const cloneComponent = <T>(component: Component<T>) => {
  return new Component(component.getProps());
};

const clonedComponent = cloneComponent(new Component("I love you"));

// 🪶Note 09: Strongly Type a Reduce Function
const array = [
  {
    name: "John",
  },
  {
    name: "Steve",
  },
];
// Method 01:
const obj = array.reduce<{ [key: string]: { name: string } }>((acc, item) => {
  acc[item.name] = item;
  return acc;
}, {});

// Method 02:
const obj2 = array.reduce<Record<string, { name: string }>>((acc, item) => {
  acc[item.name] = item;
  return acc;
}, {});

// 🪶Note 10: Use Generics to Type a Fetch Request
const fetchData = async <T>(url: string) => {
  const data = await fetch(url).then<T>((response) => response.json());
  return data;
};

const fetchResult = async () => {
  const data = await fetchData<{ name: string }>(
    "https://swapi.dev/api/people/1"
  );
  return data;
};
