// 🪶Note 07: TypeScript s Global Scope
declare global {
  function globalFunc(): boolean;
  var globalVar: number;
}

globalThis.globalFunc = () => true;
globalThis.globalVar = 1;

export let globalFuncResult = globalFunc();
let globalVarResult = globalVar;

// 🪶Note 08: Add Functionality to Existing Global Interfaces
// 💎 `interface` with same name and scope get declaration merged but not `type`.
declare global {
  interface Window {
    makeGreeting(): string;
  }
}

type TMakeGreeting = typeof window.makeGreeting;

// @ts-expect-error
globalThis.makeGreeting();

// 🪶Note 09: Add Types to Properties of Global Namespaced Interfaces
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MY_ENV_VAR: string;
    }
  }
}

process.env.MY_ENV_VAR = "Hello World";
const helloWorld = process.env.MY_ENV_VAR;

// 🪶Note 10: Collocating Types for Global Interfaces
/**
 * Here, we've actually got _multiple_ problem files!
 * Make sure to to check problem.2.ts too.
 *
 * -> Go to src/02-globals/10-event-dispatcher.problem.1.ts
 * -> Go to src/02-globals/10-event-dispatcher.problem.2.ts
 */
