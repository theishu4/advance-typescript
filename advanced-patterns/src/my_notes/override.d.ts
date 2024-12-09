declare module "overridingTypes" {
  export function getAnimatingState():
    | "before-animation"
    | "animating"
    | "after-animation";
}
