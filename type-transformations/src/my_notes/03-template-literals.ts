// 🪶Note 13: Only allow specified string pattern
type Route = `/${string}`;

export const goToRoute = (route: Route) => {};

// Should succeed: ✅

goToRoute("/users");
goToRoute("/");
goToRoute("/admin/users");

// @ts-expect-error : ❌
goToRoute("users/1");

// 🪶Note 14: Extract Union Strings Matching a Pattern
type Routes = "/users" | "/users/:id" | "/posts" | "/posts/:id";

type DynamicRoutes = Extract<Routes, `${string}:${string}`>;

// 🪶Note 15: Create a Union of Strings with All Possible Permutations of Two Unions

type BreadType = "rye" | "brown" | "white";

type Filling = "cheese" | "ham" | "salami";

type Sandwich = `${BreadType} sandwich with ${Filling}`;

// 🪶Note 16: Splitting A String into a Tuple
// Might come in handy!
import { Split } from "ts-toolbelt/out/String/Split";
// https://millsp.github.io/ts-toolbelt/modules/string_split.html

type Path = "Users/John/Documents/notes.txt";

type SplitPath = Split<Path, "/">;

// 🪶Note 17. Create an Object Whose Keys Are Derived From a Union
type TemplateLiteralKey = `${"user" | "post" | "comment"}${"Id" | "Name"}`;

type ObjectOfKeys = Record<TemplateLiteralKey, string>;

// 🪶Note 18. Transform String Literals To Uppercase
type Event = `log_in` | "log_out" | "sign_up";

type UppercaseEvent = Uppercase<Event>;
type UppercaseObject = Record<UppercaseEvent, string>;

// 👉 Their is also utility for `Lowercase<>`, `Capitalize<>`
type LowercaseEvent = Lowercase<UppercaseEvent>;
type CapitalizeEvent = Capitalize<LowercaseEvent>;
