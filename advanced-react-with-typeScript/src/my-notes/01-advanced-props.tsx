import {
  ButtonHTMLAttributes,
  ChangeEventHandler,
  ComponentProps,
} from "react";
import { Equal, Expect } from "../helpers/type-utils";

// 🪶Note 01: Type-Checking React Props With Discriminated Unions
type ModalProps = { buttonColor: string } & (
  | {
      variant: "no-title";
    }
  | {
      variant: "title";
      title: string;
    }
);

export const Modal = (props: ModalProps) => {
  if (props.variant === "no-title") {
    return (
      <div>
        <span>No title</span>
        <button
          style={{
            backgroundColor: props.buttonColor,
          }}
        >
          Click me!
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <span>Title: {props.title}</span>
        <button
          style={{
            backgroundColor: props.buttonColor,
          }}
        >
          Click me!
        </button>
      </div>
    );
  }
};

export const Test = () => {
  return (
    <div>
      {/* @ts-expect-error */}
      <Modal buttonColor="red" />
      <Modal
        buttonColor="red"
        variant="no-title"
        // @ts-expect-error
        title="Oh dear"
      />
      <Modal variant="title" title="Hello" buttonColor="red" />
    </div>
  );
};

// 🪶Note 02: Differentiating Props With a Boolean Discriminator
type EmbeddedPlaygroundProps =
  | {
      useStackblitz: true;
      stackblitzId: string;
    }
  | {
      useStackblitz?: false;
      codeSandboxId: string;
    };

const EmbeddedPlayground = (props: EmbeddedPlaygroundProps) => {
  if (props.useStackblitz) {
    return (
      <iframe
        src={`https://stackblitz.com/edit/${props.stackblitzId}?embed=1`}
      />
    );
  }

  return <iframe src={`https://codesandbox.io/embed/${props.codeSandboxId}`} />;
};

<>
  <EmbeddedPlayground useStackblitz stackblitzId="my-stackblitz-id" />
  <EmbeddedPlayground codeSandboxId="my-codeSandbox-id" />

  <EmbeddedPlayground
    useStackblitz
    // @ts-expect-error
    codeSandboxId="my-codeSandbox-id"
  />

  {/* @ts-expect-error */}
  <EmbeddedPlayground stackblitzId="my-stackblitz-id" />
</>;

// 🪶Note 03: Conditionally Require Props With Discriminated Unions
type InputProps = (
  | {
      value: string;
      onChange: ChangeEventHandler;
    }
  | {
      value?: undefined;
      onChange?: undefined;
    }
) & {
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

export const Test2 = () => {
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

// 🪶Note 04: Finding a Better Type Definition For A Mapped Component
interface TableProps {
  renderRow: (i: number) => React.ReactNode;
}

const Table = (props: TableProps) => {
  return <div>{[0, 1, 3].map(props.renderRow)}</div>;
};

export const Parent = () => {
  return (
    <>
      <Table
        renderRow={(index) => {
          type test = Expect<Equal<typeof index, number>>;
          return <div key={index}>{index}</div>;
        }}
      />
      <Table
        renderRow={(index) => {
          return null;
        }}
      />
      <Table
        // @ts-expect-error
        renderRow={<div></div>}
      />
      <Table
        renderRow={(index) => {
          return index;
        }}
      />
    </>
  );
};

// 🪶Note 05: Syncing Types without Manual Updates
const classNamesMap = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-200 text-black",
  success: "bg-green-500 text-white",
};

type ButtonProps = { variant: keyof typeof classNamesMap };

export const Button = (props: ButtonProps) => {
  return <button className={classNamesMap[props.variant]}>Click me</button>;
};

const RandomComponent = () => {
  return (
    <>
      <Button variant="primary"></Button>
      <Button variant="secondary"></Button>
      <Button variant="success"></Button>

      {/* @ts-expect-error */}
      <Button variant="something"></Button>
      {/* @ts-expect-error */}
      <Button></Button>
    </>
  );
};

// 🪶Note 06: The Partial Autocompletion Quirk
const presetSizes = {
  xs: "0.5rem",
  sm: "1rem",
};

type Size = keyof typeof presetSizes;

type LooseSize = Size | (string & {});

export const Icon = (props: { size: LooseSize }) => {
  return (
    <div
      style={{
        width:
          props.size in presetSizes
            ? presetSizes[
                /**
                 * The 'as' is necessary here because TS can't seem to narrow
                 * props.size to Size properly
                 */
                props.size as Size
              ]
            : props.size,
      }}
    />
  );
};

<>
  ``
  <Icon size="sm"></Icon>
  <Icon size="xs"></Icon>
  <Icon size="10px"></Icon>
</>;

// 🪶Note 07: Extracting Keys and Values from a Type
const BACKEND_TO_FRONTEND_STATUS_MAP = {
  0: "pending",
  1: "success",
  2: "error",
} as const;

type BackendStatus = keyof typeof BACKEND_TO_FRONTEND_STATUS_MAP;
type FrontendStatus = (typeof BACKEND_TO_FRONTEND_STATUS_MAP)[BackendStatus];

type test = [
  Expect<Equal<BackendStatus, 0 | 1 | 2>>,
  Expect<Equal<FrontendStatus, "pending" | "success" | "error">>
];

// 🪶Note 08: Ensuring Correct Inference for Prop Types
const buttonProps = {
  type: "button",
  // @ts-expect-error
  illegalProperty: "I AM ILLEGAL",
} satisfies ComponentProps<"button">;

<>
  <button {...buttonProps}>Click Me!</button>
</>;

const buttonPropType = buttonProps.type;

type test2 = Expect<Equal<typeof buttonPropType, "button">>;

// 🪶Note 09: Inference from a Single Source of Truth
const buttonPropsMap = {
  reset: {
    className: "bg-blue-500 text-white",
    type: "reset",
    // @ts-expect-error
    illegalProperty: "whatever",
  },
  submit: {
    className: "bg-gray-200 text-black",
    type: "submit",
    // @ts-expect-error
    illegalProperty: "whatever",
  },
  next: {
    className: "bg-green-500 text-white",
    type: "button",
    // @ts-expect-error
    illegalProperty: "whatever",
  },
} satisfies Record<string, ComponentProps<"button">>;

type ButtonProp = {
  variant: keyof typeof buttonPropsMap;
};

export const CustomButton = (props: ButtonProp) => {
  return <button {...buttonPropsMap[props.variant]}>Click me</button>;
};

const ParentComponent = () => {
  return (
    <>
      <CustomButton variant="next"></CustomButton>
      <CustomButton variant="reset"></CustomButton>
      <CustomButton variant="submit"></CustomButton>

      {/* @ts-expect-error */}
      <CustomButton variant="something"></CustomButton>
      {/* @ts-expect-error */}
      <CustomButton></CustomButton>
    </>
  );
};
