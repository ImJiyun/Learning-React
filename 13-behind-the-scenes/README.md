## Behind The Scene

- How React updates the DOM
- Avoiding unnecessary updates
- A closer look at keys
- State scheduling & State batching

### How React works behind the scenes

- Rendering components means React executes component function
- It starts with the app component function because the app compomnent is the first component and only component in the main.jsx file

```jsx
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

- every component function must return something that can be rendered
- returned JSX code in the end is translated to JavaScript code and translated to actual elements that can be rendered on the screen.

```jsx
import { useState } from "react";

import Counter from "./components/Counter/Counter.jsx";
import Header from "./components/Header.jsx";
import { log } from "./log.js";

function App() {
  log("<App /> rendered");

  const [enteredNumber, setEnteredNumber] = useState(0);
  const [chosenCount, setChosenCount] = useState(0);

  function handleChange(event) {
    setEnteredNumber(+event.target.value);
  }

  function handleSetClick() {
    setChosenCount(enteredNumber);
    setEnteredNumber(0);
  }
  return (
    <>
      <Header />
      <main>
        <section id="configure-counter">
          <h2>Set Counter</h2>
          <input type="number" onChange={handleChange} value={enteredNumber} />
          <button onClick={handleSetClick}>Set</button>
        </section>
        <Counter initialCount={chosenCount} />
      </main>
    </>
  );
}

export default App;
```

- whenever React encounters the custom component in the JSX code, React also executes those component functions from top to bottom.
- The relation between components is internally modified as a tree structure

### memo

- will prevent unnecessary component function executions.

```jsx
import { useState, memo } from "react";
import IconButton from "../UI/IconButton.jsx";
import MinusIcon from "../UI/Icons/MinusIcon.jsx";
import PlusIcon from "../UI/Icons/PlusIcon.jsx";
import CounterOutput from "./CounterOutput.jsx";
import { log } from "../../log.js";

function isPrime(number) {
  log("Calculating if is prime number", 2, "other");

  if (number <= 1) {
    return false;
  }

  const limit = Math.sqrt(number);

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

const Counter = memo(function Counter({ initialCount }) {
  log("<Counter /> rendered", 1);

  const initialCountIsPrime = isPrime(initialCount);

  const [counter, setCounter] = useState(initialCount);

  function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1);
  }

  function handleIncrement() {
    setCounter((prevCounter) => prevCounter + 1);
  }

  return (
    <section className="counter">
      <p className="counter-info">
        The initial counter value was <strong>{initialCount}</strong>. It{" "}
        <strong>is {initialCountIsPrime ? "a" : "not a"}</strong> prime number.
      </p>
      <p>
        <IconButton icon={MinusIcon} onClick={handleDecrement}>
          Decrement
        </IconButton>
        <CounterOutput value={counter} />
        <IconButton icon={PlusIcon} onClick={handleIncrement}>
          Increment
        </IconButton>
      </p>
    </section>
  );
});

export default Counter;
```

- `memo()` compares prop values: the old one and the new one
  - will take a look at the props of component function whenever the component function would execute again
  - if those old and new prop values are the same, the component function will not execute
  - It not equal, component function will execute
- only prevent function executions triggered by the parent component (It does NOT care about internal change)
- Don't overuse memo
  - use it as high up in the component tree as possible => blocking a component execution there will also block all child component executions
- Checking props with `memo()` costs performance!
  - don't wrap it around all components - it will just add a lot of unnecessary checks
- Don't use it components where props will change frequently
  - `memo()` would just perform a meaningless check in such cases (which costs performance)

### useCallback hook

- `useCallback` hook in React memoizes a function so that it does not get recreated on every render.
- It returns a cached version of the function, which only changes if its dependencies change.

```jsx
import { memo } from "react";

import { log } from "../../log.js";

const IconButton = memo(function IconButton({ children, icon, ...props }) {
  log("<IconButton /> rendered", 2);

  const Icon = icon;
  return (
    <button {...props} className="button">
      <Icon className="button-icon" />
      <span className="button-text">{children}</span>
    </button>
  );
});

export default IconButton;
```

- Even though this component is wrapped by memo, it gets re-rendered.
- This happens because its onClick prop receives a new function reference on each render of the `Counter` component.
  - React treats objects and functions as new values every time they are re-created, even if their logic remains unchanged.
  - Since `handleIncrement` and `handleDecrement` are nested inside `Counter`, they are recreated on each render.
  - Because the `onClick` prop gets a new function reference, `React.memo` cannot prevent unnecessary re-renders of `IconButton`.

```jsx
import { useState, memo, useCallback, useMemo } from "react";

import IconButton from "../UI/IconButton.jsx";
import MinusIcon from "../UI/Icons/MinusIcon.jsx";
import PlusIcon from "../UI/Icons/PlusIcon.jsx";
import CounterOutput from "./CounterOutput.jsx";
import CounterHistory from "./CounterHistory.jsx";
import { log } from "../../log.js";

function isPrime(number) {
  log("Calculating if is prime number", 2, "other");
  if (number <= 1) {
    return false;
  }

  const limit = Math.sqrt(number);

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

const Counter = memo(function Counter({ initialCount }) {
  log("<Counter /> rendered", 1);
  // prevent the function called inside of the component to be executed every time the component gets rendered
  // unless the input chages
  // inside of the useMemo, we can put the function that is expensive to run
  // pass the annoynmous function and it will call the normal function
  const initialCountIsPrime = useMemo(
    () => isPrime(initialCount),
    [initialCount]
  );
  // only when dependency array changes, the function will be executed again
  // don't overuse useMemo, because it can lead to poor performance

  // const [counter, setCounter] = useState(initialCount);
  const [counterChanges, setCounterChanges] = useState([
    { value: initialCount, id: Math.random() * 1000 },
  ]);

  const currentCounter = counterChanges.reduce(
    (prevCounter, counterChange) => prevCounter + counterChange.value,
    0
  );

  // nested functions : they are inside the component function
  // when the component function gets executed, these functions will be recreated every time
  // as a object, they are not the same function

  // with useCallback, we can prevent this recreation
  // useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed
  const handleDecrement = useCallback(function handleDecrement() {
    // setCounter((prevCounter) => prevCounter - 1);
    setCounterChanges((prevCounterChanges) => [
      { value: -1, id: Math.random() * 1000 },
      ...prevCounterChanges,
    ]);
  }, []);
  // in dependency array, we can put the props or state values that are used in the function
  // setCounter is not a dependency, because it is a function that is not recreated every time
  // state updating functions are guaranteed to be the same function by React

  const handleIncrement = useCallback(function handleIncrement() {
    // setCounter((prevCounter) => prevCounter + 1);
    setCounterChanges((prevCounterChanges) => [
      { value: 1, id: Math.random() * 1000 },
      ...prevCounterChanges,
    ]);
  }, []);

  return (
    <section className="counter">
      <p className="counter-info">
        The initial counter value was <strong>{initialCount}</strong>. It{" "}
        <strong>is {initialCountIsPrime ? "a" : "not a"}</strong> prime number.
      </p>
      {/* Every time component function gets executed, onClick value becomes a new prop value */}
      <p>
        <IconButton icon={MinusIcon} onClick={handleDecrement}>
          Decrement
        </IconButton>
        <CounterOutput value={currentCounter} />
        <IconButton icon={PlusIcon} onClick={handleIncrement}>
          Increment
        </IconButton>
      </p>
      <CounterHistory history={counterChanges} />
    </section>
  );
});
export default Counter;
```

### `useMemo` hook

- Just as memo hook works with component function, useMemo works the same way with normal function
- `useMemo` executes a given function only when its dependencies change.
- Otherwise, it returns the previously computed value, avoiding redundant calculations.

```tsx
// memo is wrapping the component function
// useMemo is wrapping the noraml function that is called inside of the component to prevent normal function to be executed every time the component gets rendered
// use useMemo only when the function is expensive to run
function isPrime(number) {
  log("Calculating if is prime number", 2, "other");
  if (number <= 1) {
    return false;
  }

  const limit = Math.sqrt(number);

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

const Counter = memo(function Counter({ initialCount }) {
  log("<Counter /> rendered", 1);
  // prevent the function called inside of the component to be executed every time the component gets rendered
  // unless the input chages
  // inside of the useMemo, we can put the function that is expensive to run
  // pass the annoynmous function and it will call the normal function
  const initialCountIsPrime = useMemo(
    () => isPrime(initialCount),
    [initialCount]
  );
  // only when dependency array changes, the function will be executed again
  // don't overuse useMemo, because it can lead to poor performance
});
export default Counter;
```

- Do NOT overuse `useMemo` - It will need an extra execution to perform extra dependency value comparison

### How React updates the website UI

- when we visit the website for the first time or reload it, the first page we encounter is index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Behind the Scenes</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- And React App is inside the div tag
- React code is inserted by React
- However, re-executed component function doesn't mean all JSX code produced by that component function is reinserted in the DOM
- The old code is not thrown away and replaced by the new HTML code
- React checks for necessary DOM updates via a "**Virtual DOM**"
- It creates & compares virtual DOM snapshots to find out which parts of the rendered UI need to be updated
- Steps
  1.  React creates a component tree
  2.  React creates a virtual snapshot of the target HTML code - it doesn't reach out to the real DOM yet but creates a virtual representation of how real DOM should look like
  3.  React compares the new _virtual_ DOM snapshots to previous (old) _virtual_ snapshot.
  4.  React identify and applies changes to the "_Real DOM_"
- Examples
  - If the app just started, there's no last snapshot, so React sees that everything changed and goes ahead to real DOM and makes those changes
  - the entire virtual DOM is inserted into the real DOM (div tag with id root)
  - when a button is created, React again creates component tree and finds out only some of functions were executed
  - React creates a virtual snapshot of the target HTML code
  - React compares the new virtual DOM snapshots to previous (old) virtual snapshot.
  - React identify and applies changes to the "Real DOM"

### Why keys are important when managing the state

- state registered in a component function is scoped to that component and is recreated whenever we reuse a component

- `App.jsx`
  `

```jsx
return (
  <>
    <Header />
    <main>
      <ConfigureCounter onSet={handleSetCount} />
      <Counter initialCount={chosenCount} />
      <Counter initialCount={0} />
    </main>
  </>
);
```

- `Counter.jsx`

```jsx
import { useState, memo, useCallback, useMemo } from "react";

import IconButton from "../UI/IconButton.jsx";
import MinusIcon from "../UI/Icons/MinusIcon.jsx";
import PlusIcon from "../UI/Icons/PlusIcon.jsx";
import CounterOutput from "./CounterOutput.jsx";
import { log } from "../../log.js";

const Counter = memo(function Counter({ initialCount }) {
  const [counter, setCounter] = useState(initialCount);

  // skipped below code...
});

export default Counter;
```

- both `Counter` component has `counter` state inside, and every `Counter` component receives its own independent counter state
- React tracks state by component type & position (of that component) in the tree
- key can prevent a problem when we have sibling components that the position of those component may change - like dynamically generated lists
- don't use a key value that is stricly connected to a specific value
- Using keys not only helps with state management but also helps React render lists in a optimal way
- keys aren't just useful in lists

```jsx
import { useState } from "react";

import Counter from "./components/Counter/Counter.jsx";
import Header from "./components/Header.jsx";
import { log } from "./log.js";
import ConfigureCounter from "./components/Counter/ConfigureCounter.jsx";

function App() {
  log("<App /> rendered");

  const [chosenCount, setChosenCount] = useState(0);

  function handleSetCount(newCount) {
    setChosenCount(newCount);
  }

  return (
    <>
      <Header />
      <main>
        <ConfigureCounter onSet={handleSetCount} />
        <Counter key={chosenCount} initialCount={chosenCount} />
        <Counter initialCount={0} />
      </main>
    </>
  );
}

export default App;
```

- If we should use some state that may change in parent component, and should lead to child component
- When using key, React will throw array the old component instance and recreate it
- Using key is helpful because the old component is removed and a new component is reinserted.
- We don't have to use useEffect in a child component (it causes extra execution)

### State Scheduling & Batching

- when we call a state updating function, the state update will be scheduled by React. It will not be executed instantly
- state updating function will trigger a new component function execution and the new state will be available the next time this executes
- because state updates are scheduled, it's considered a best practice to perform state updates that depend on the old state value using function form
- setting a function that passes a function (this function receives the old state snapshot) and return the new state snapshot
- with this approach, React guarantees us that here we will always get the latest state snapshot available

- state batching : multiple state updates triggered from the same function are batched together and will only lead to one component function execution
