# 1. Type Transform Workshop

## 1. Inference Basics

1.  `ReturnType<>` and `Parameters<>`
2.  Extracting type from tuples
3.  `Awaited<>`: Extract a Promise result
4.  Create a Union type from an Object keys

## 2. Union and Indexing

5.  Extract from a union
6.  Exclude from a union
7.  Index Access
8.  Discriminated union to discriminator
9.  Extract specific member from a union with index access
10. Get All of an object value
11. Create Union out of array values
12. Extract type of element of an array

## 3. Template literals

13. Only allow specified string pattern
14. Extract Union Strings Matching a Pattern
15. Create a Union of Strings with All Possible
    Permutations of Two Unions
16. Splitting A String into a Tuple
17. Create an Object Whose Keys Are Derived From a Union

### 3.5 Type helpers pattern

18. Create Functions that Return Types
19. Ensure Type Safety in a Type Helper
20. Create Type Helper with multiple parameter
21. Optional Type Parameters with default type
22. Functions as Constraints for Type Helpers
23. Constraining Types for Anything but null or undefined
24. Constraining Type Helpers to Non Empty Arrays

## 4. Conditional Types and Infer

25. Add Conditional Logic to a Type Helper
26. Nested logic in a Type Helper
27. Inferring Elements Inside a Conditional with Infer
28. Extract Type Arguments to Another Type Helper
29. Extract Parts of a String with a Template Literal
30. Extract the Result of an Async Function
31. Extract the Result From Several Possible Function Shapes
32. Distributivity in Conditional Types

## 5. Key Remapping

33. Map Over a Union to Create an Object
34. Mapped Types with Objects
35. Conditionally Extract Properties from Object
36. Map a Discriminated Union to an Object
37. Map an Object to a Union of Tuples
38. Transform an Object into a Union of Template Literals
39. Transform a Discriminated Union into a Union

## 6. Challenges

1. Transform Dynamic Path Parameters from Strings to Objects
2. Transform an Object into a Discriminated Union
3. Transform a Discriminated Union with Unique Values to an Object
4. Construct a Deep Partial of an Object

# 2. Typescript Generics Workshop

## 1. Generics Intro

1. Typing function: Return what I pass in
2. Restricting Type using Generics Constraints
3. Multiple Type Parameters
4. Approaches for Typing Object Parameters
5. Generics in Classes
6. Generic Mapper Function

## 2. Passing Type Arguments

7. Add Type Parameters to a Function
8. Infer Types from Type Arguments
9. Strongly Type a Reduce Function
10. Use Generics to Type a Fetch Request

## 3. Art of Type Arguments

11. Generics at Different Levels
12. Typed Object Keys
13. Understand Literal Inference in Generics
14. Understand Generic Inference When Using Objects as Arguments
15. Inferring Literal Types from any Basic Type
16. Infer the Type of an Array Member
17. Generics in a Class Names Creator

## 4. Generics Advanced

18. Generics with Conditional Types
19. Fixing Errors in Generic Functions
20. Generic Function Currying
21. Generic Interfaces with Functions
22. Spotting Useless Generics
23. Spotting Missing Generics
24. Refactoring Generics for a Cleaner API
25. The Partial Inference Problem

## 5. Function Overloads

26. What is a Function Overload --> issue
27. Function Overloads vs Conditional Types
28. Debugging Overloaded Functions
29. Function Overloads vs Union Types
30. Generics in Function Overloads
31. Solving an Inference Mystery
32. Use Function Overloads to Infer Initial Data
33. The Instantiated with Subtype Error

## 6. Challenges

1. Make An Infinite Scroll Function Generic with Correct Type Inference
2. Create a Function with a Dynamic Number of Arguments
3. Create a Pick Function
4. Create a Form Validation Library
5. Improve a Fetch Function to Handle Missing Type Arguments
6. Typing a Function Composition with Overloads and Generics
7. Build an Internationalization Library