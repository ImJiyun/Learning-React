## Refs & Portal
### What is `ref` in React?

- A **ref** is a special object that allows us to reference and interact with a DOM element or a React component directly.  
- We can create a ref using the `useRef` hook, which is a built-in React hook. It must be called inside a functional component or a custom hook.
- A ref value can be connected to a JSX element using the `ref` attribute. 
- The `ref` object has a single property, **`current`**, which holds the reference to the connected DOM element or value.  
- By using refs, we can directly access or manipulate the underlying DOM element without going through React’s state or props mechanism.

---

### Benefits of using `ref`:
1. **Access to DOM Elements**: Refs can directly interact with DOM elements (e.g., getting input values or focusing an input).  
2. **Avoiding Re-renders**: Unlike state, updating a `ref` value does not cause a component to re-render.  
3. **Useful in Integration**: They are helpful when integrating React with non-React libraries that manipulate the DOM.  

---

### Example Before Using `ref`
```jsx
import { useState } from "react";

export default function Player() {
  const [enteredPlayerName, setEnteredPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    setSubmitted(false);
    setEnteredPlayerName(event.target.value);
  }

  function handleClick() {
    setSubmitted(true);
  }

  return (
    <section id="player">
      <h2>Welcome {submitted ? enteredPlayerName : "unknown entity"}</h2>
      <p>
        <input 
          type="text" 
          onChange={handleChange} 
          value={enteredPlayerName} 
        />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
```
- we need two states, one with onChange prop, one with onClick prop

### Example After Using `ref`
```jsx
import { useRef, useState } from "react";

export default function Player() {
  const playerName = useRef(null); // Initialize the ref with `null`
  const [enteredPlayerName, setEnteredPlayerName] = useState("");

  function handleClick() {
    setEnteredPlayerName(playerName.current.value);
    // Access the value property of the input element using `current`
  }

  return (
    <section id="player">
      <h2>Welcome {enteredPlayerName || "unknown entity"}</h2>
      <p>
        <input ref={playerName} type="text" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
```

---

### Key Points:
1. **Using `useRef`**:
   - `useRef` returns an object with a property `current`.
   - Example: `const myRef = useRef(initialValue); // myRef.current = initialValue`
   
2. **Connecting a `ref` to a DOM Element**:
   - Attach the `ref` object to a JSX element using the `ref` attribute.
   - Example: `<input ref={myRef} />`
   
3. **Accessing the Element**:
   - After the element is rendered, `myRef.current` will refer to the DOM node.

4. **Difference from State**:
   - Updating a ref does not trigger a re-render, whereas state does.

5. **When to Use `ref`**:
   - Use refs when direct interaction with a DOM element is required (e.g., accessing input values, managing focus).
   - Avoid overusing refs for managing application data or triggering rendering logic; React's state and props should handle that instead.

```jsx
import { useRef, useState } from "react";

export default function TimerChallenge({ title, targetTime }) {
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  // ref can be used to manage the value
  const timer = useRef();
  // it will be component scoped, not re-rendered when the component re-renders
  // the value is not lost when the component re-renders
  // if we have a value that should be managed, but not reset, we can use ref

  function handleStart() {
    timer.current = setTimeout(() => {
      setTimerExpired(true);
    }, targetTime * 1000);
    setTimerStarted(true);
  }

  function handleStop() {
    // how can we access the timer that was set with setTimeout?
    clearTimeout(timer.current);
  }

  return (
    <section className="challenge">
      <h2>{title}</h2>
      {timerExpired && <p>You lost!</p>}
      <p className="challenge-time">
        {targetTime} second{targetTime > 1 ? "s" : ""}
      </p>
      <p>
        <button onClick={timerStarted ? handleStop : handleStart}>
          {timerStarted ? "Stop" : "Start"} Challenge
        </button>
      </p>
      <p className={timerStarted ? "active" : undefined}>
        {timerStarted ? "Time is running..." : "Timer inactive"}
      </p>
    </section>
  );
}

```

- React is a declarative code, not imperative code. 
- It's about not directly manipulating the DOM. 
- So it's not recommended to manipulating the DOM by using ref. <hr/>

#### refs vs state
- state
	- causes component re-evaluation (re-execution) when changed
	- should be used for values directly reflected in the UI
	- should not be used for "behind the scenes" values that have no direct UI impact
- refs
	- do not cause component re-execution when changed
	- can be used to gain direct DOM element access (-> great for reading values or accessing certain browser APIs)

- refs can be used for managing any kind of value
- ref will not be reset or cleared when this component re-executes
- also doesn't cause component function to execute again

---

### `useImperativeHandle`

**Definition**:  
A React Hook that allows customization of the instance value exposed when using `ref` with functional components. It works in combination with `forwardRef`.

---

**Arguments**:  
1. **First Argument**:  
   - The `ref` object passed to the component (via `forwardRef`).
2. **Second Argument**:  
   - A function that returns an object.  
   - This object contains the properties and methods that should be exposed to parent components via the `ref`.

---

**Why and When to Use**:  
- Use `useImperativeHandle` when:  
  1. A component needs to expose specific methods or properties to its parent (e.g., triggering a modal, controlling animations, etc.).  
  2. Avoiding direct manipulation of the DOM but still requiring imperative actions (like calling `showModal` on a `<dialog>` element).  
- **Best Practice**: Prefer declarative programming in React. Use this hook only when imperative handling is unavoidable.

---

### Example:

#### Parent Component (`TimerChallenge`)
- Manages a timer and exposes a `ResultModal` component to show the result.
- Uses `useRef` to create `dialog` (to reference the `ResultModal`) and `timer` (to store the timeout ID).

**Key Points**:  
- `handleStart`: Starts the timer and calls the `open` method on `ResultModal` (via `dialog.current`) after the timer expires.  
- `handleStop`: Stops the timer by clearing the timeout using `clearTimeout`.

---

#### Child Component (`ResultModal`)
- A modal that displays the result of the timer challenge.

**Key Points**:  
- `forwardRef` wraps the component to allow the parent to pass a `ref`.  
- `useImperativeHandle` defines the methods available on the `ref` object:  
  - **`open` Method**: Calls `showModal` on the `dialog` element to display the modal.

---

```jsx
import { useRef, useState } from "react";
import ResultModal from "./ResultModal.jsx";

export default function TimerChallenge({ title, targetTime }) {
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  const timer = useRef(); // Stores the timeout ID
  const dialog = useRef(); // References the ResultModal component

  function handleStart() {
    setTimerStarted(true);

    timer.current = setTimeout(() => {
      setTimerExpired(true);
      dialog.current.open(); // Calls the 'open' method defined in ResultModal
    }, targetTime * 1000);
  }

  function handleStop() {
    clearTimeout(timer.current); // Stops the timer
    setTimerStarted(false); // Resets the timer state
  }

  return (
    <>
      <ResultModal ref={dialog} targetTime={targetTime} result="lost" />
      <section className="challenge">
        <h2>{title}</h2>
        <p className="challenge-time">
          {targetTime} second{targetTime > 1 ? "s" : ""}
        </p>
        <p>
          <button onClick={timerStarted ? handleStop : handleStart}>
            {timerStarted ? "Stop" : "Start"} Challenge
          </button>
        </p>
        <p className={timerStarted ? "active" : undefined}>
          {timerStarted ? "Time is running" : "Timer inactive"}
        </p>
      </section>
    </>
  );
}
```

---

```jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const ResultModal = forwardRef(function ResultModal({ result, targetTime }, ref) {
  const dialog = useRef(); // References the built-in <dialog> element

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal(); // Opens the modal
    },
  }));

  return (
    <dialog ref={dialog} className="result-modal">
      <h2>You {result}</h2>
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>X seconds left.</strong>
      </p>
      <form method="dialog">
        <button>Close</button>
      </form>
    </dialog>
  );
});

export default ResultModal;
```

- Since React 19
```jsx
export default function ResultModal({ ref, result, targetTime }) {
  return (
    // the built-in dialog is invisible by default
    <dialog ref={ref} className="result-modal">
      {/* if we force the dialog to be visible by setting open to true, the buil-in backdrop will not be shown */}
      {/* we need to open the dialog programmatically */}
      <h2>You {result}</h2>
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>X seconds left.</strong>
      </p>
      <form action="dialog">
        {/* inside dialog, a form will close the dialog */}
        <button>Close</button>
      </form>
    </dialog>
  );
}
```

--- 

### Portals

**Definition**:  
Portals in React allow us to render JSX into a different part of the DOM tree than its parent component. Normally, a React component is rendered within its parent DOM hierarchy, but with portals, we can "teleport" JSX to another DOM node.

---
1. **How Portals Work**:
    
    - React still maintains the component's state and event bubbling, even if the rendered JSX is placed elsewhere in the DOM.
2. **React-DOM Library**:
    
    - `createPortal` is part of the `react-dom` library.
    - It takes two arguments:
        - **What to render**: JSX code.
        - **Where to render**: A DOM node.
    
    `createPortal(jsx, destinationDOMNode);`
    

---

### When to Use Portals

1. **Modals or Dialogs**:
    
    - Modals often need to be rendered outside the component hierarchy to avoid issues like `z-index` conflicts or styles affecting the rest of the application.
2. **Tooltips and Popups**:
    
    - Tooltips often require precise positioning relative to the screen and need to bypass parent component styles.
3. **Overlays**:
    
    - Full-screen overlays often need to be rendered directly into the `<body>` tag.
4. **Performance Optimization**:
    
    - Rendering heavy or detached components in a separate part of the DOM can sometimes simplify layout management.

---

### Example: ResultModal with Portals

1. **What it Does**:
    
    - Renders the `<dialog>` element in a separate DOM node (`#modal`) instead of the parent hierarchy.
2. **Key Code Explanation**:
    
    - **Portals**:  
        The `createPortal` function ensures the JSX is rendered into the DOM element with the `id="modal"`.
        
        `return createPortal(   <dialog ref={dialog} className="result-modal">     {/* Modal content */}   </dialog>,   document.getElementById("modal") // Teleports this JSX to #modal );`
        
    - **React Integration**:  
        Even though the modal is rendered outside the main React tree, event bubbling (e.g., clicks) and React state management still work seamlessly.
        
3. **Advantages**:
    
    - Keeps modal-related code logically grouped within the `ResultModal` component while avoiding style and structural conflicts.

```jsx
import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

const ResultModal = forwardRef(function ResultModal(
  { targetTime, remainingTime, onReset },
  ref
) {
  const dialog = useRef();

  const userLost = remainingTime <= 0;
  const formattedRemainingTime = (remainingTime / 1000).toFixed(2);
  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
    };
  });

  return createPortal(
    // the built-in dialog is invisible by default
    <dialog ref={dialog} className="result-modal">
      {/* if we force the dialog to be visible by setting open to true, the buil-in backdrop will not be shown */}
      {/* we need to open the dialog programmatically */}
      {userLost && <h2>You lost</h2>}
      {!userLost && <h2>Your score : {score}</h2>}
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with{" "}
        <strong>{formattedRemainingTime} seconds left.</strong>
      </p>
      <form action="dialog" onSubmit={onReset}>
        {/* inside dialog, a form will close the dialog */}
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById("modal")
  );
});

export default ResultModal;
```