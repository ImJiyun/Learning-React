## TypeScript

### What is TypeScript?

- It is a superset to JavaScript
- It adds static typing to JavaScript
- It is useful because
  - JavaScript on its own is dyanamically typed
  - It can prevent unintended error
- NOTE : TS code does NOT run in the browser, so we need to complie TS to JS
  - all types will be removed during compliation process
  - In that step, we will be notified about errors
- To compile the file, type `npx tsc file-name`
- Even if it gets an error, it still gives us JS file

### Type inference

- TypeScript will infer even if we don't specify types

```typescript
// Type inference
let course = "React";

course = 123; // throws an error
```
