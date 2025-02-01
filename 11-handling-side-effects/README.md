# Handling Side Effects - useEffect

- understanding Side Effects & useEffect()
- Effects & Dependencies
- When Not to use useEffect()

---

### What Are "Side Effects"?

- **Definition**: Side effects are tasks that need to be executed in an application for it to work correctly but are not directly related to rendering the component.

  - Example: Fetching data, interacting with browser APIs, or managing subscriptions.

- **Key Characteristics**:

  1. Not directly tied to returning JSX or updating the UI in the current render cycle.
  2. Often involve asynchronous behavior (e.g., fetching data in the future).

- **Example**:

```jsx
navigator.geolocation.getCurrentPosition((position) => {
  const sortedPlaces = sortPlacesByDistance(
    AVAILABLE_PLACES,
    position.coords.latitude,
    position.coords.longitude
  );
});
```

- In the above code:
  - The task of getting the user's location and sorting places is a side effect because:
    1. It is not directly related to rendering the component.
    2. It involves a future callback when the user's location is available.

---

### Why the Flaw?

- **Problem**: The `navigator.geolocation.getCurrentPosition` call is executed directly inside the `App` component.
  - Each time the component re-renders, it triggers this code, leading to an **infinite loop** because:
    1. The location is fetched.
    2. State is updated using `setAvailablePlaces`.
    3. The component re-renders, restarting the process.

---

### Handling Side Effects with `useEffect`

#### **Key Points About `useEffect`:**

1. **Purpose**: Allows us to handle side effects in functional components. Unlike useState, or useRef, it doesn't return a value
2. **First Argument**: A function containing the side effect code.
3. **Second Argument**: Dependency array, which controls when the effect runs.
   ```jsx
   useEffect(() => {
     // Side effect code
   }, [dependencies]);
   ```
4. **Execution Timing**:

   - The effect function runs **AFTER** the component renders.
   - React skips re-execution unless one of the dependencies has changed.

#### **Correcting Infinite Loops**

- Without `useEffect`, state updates can lead to infinite re-renders.
- Adding an empty dependency array (`[]`) ensures the side effect runs only once after the initial render.
- Without an dependency array, the component will run into an infinite loop.

```jsx
useEffect(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    const sortedPlaces = sortPlacesByDistance(
      AVAILABLE_PLACES,
      position.coords.latitude,
      position.coords.longitude
    );
    setAvailablePlaces(sortedPlaces);
  });
}, []); // Effect runs once after the component mounts
```

---

### Effects & Dependencies

#### **Dependency Array**

- props or state values that the effect depends on. (any value that causes the component function to execute again)
- React re-runs the effect when any listed value changes.

#### **Example**:

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(`Count changed: ${count}`);
}, [count]); // Effect runs when `count` changes
```

#### **Empty Dependency Array**

- Ensures the effect runs only once (on initial render).

#### **No Dependency Array**

- Runs the effect after **every render**, which can lead to performance issues or infinite loops.

---

### Not All Side Effects Require `useEffect`

Side effects that are **user-triggered** and are not tied to the component lifecycle can be handled directly in event handler functions without requiring `useEffect`.

 `handleSelectPlace`

```jsx
function handleSelectPlace(id) {
  // Directly related to rendering JSX code
  setPickedPlaces((prevPickedPlaces) => {
    if (prevPickedPlaces.some((place) => place.id === id)) {
      return prevPickedPlaces; // Avoid duplicates
    }

    const place = AVAILABLE_PLACES.find((place) => place.id === id);
    return [place, ...prevPickedPlaces]; // Update state
  });

  // Side effect: Saving selected place IDs to localStorage
  const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || "[]";

  if (storedIds.indexOf(id) === -1) {
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify([id, ...storedIds]) // Update localStorage
    );
  }
}
```

---

### Why `useEffect` is NOT Needed Here:

1. **Triggered by User Action**:

   - The code inside `handleSelectPlace` runs **only** when the user selects a place. It is not related to the component's rendering process, so using `useEffect` is unnecessary.

2. **Avoids Infinite Loops**:

   - Since the function is only called in response to a user click, it doesn't create re-render loops like a state update inside `useEffect` might.

3. **Rules of Hooks**:

   - We cannot use `useEffect` inside a nested function (e.g., inside `handleSelectPlace`). Hooks are only valid at the top level of a component or custom Hook.

4. **Side Effect is Context-Specific**:

   - The side effect (updating `localStorage`) occurs **alongside** the primary logic of updating the UI state (`pickedPlaces`). Separating it into `useEffect` is unnecessary because it aligns with the handler's purpose.

### Another Redundant `useEffect` Example

#### Code

```jsx
useEffect(() => {
  const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  const storedPlaces = storedIds.map((id) =>
    AVAILABLE_PLACES.find((place) => place.id === id)
  );

  setPickedPlaces(storedPlaces);
}, []);
```

#### Why This `useEffect` is Redundant

1. **Synchronous Operations**:

   - Accessing `localStorage` is a **synchronous operation**. Unlike asynchronous operations (e.g., API calls), there’s no delay or dependency on browser events. Thus, this code can be executed **once** at the top level of the component (outside `useEffect`).

2. **Static Data**:

   - The data being accessed (`localStorage` and `AVAILABLE_PLACES`) is static during the lifecycle of the component. There's no need to rely on the lifecycle behavior provided by `useEffect`.

3. **Initialization Logic**:

   - This is effectively **initialization logic**, best placed **outside the component's rendering lifecycle**, e.g., directly in the initial state or before the component function body.

---

### Improved Code Without `useEffect`

The same logic can be incorporated as part of the initial state using React's lazy initialization for `useState`:

```jsx
const storedPlaces = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const initialPickedPlaces = storedPlaces.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const [pickedPlaces, setPickedPlaces] = useState(initialPickedPlaces);

  // ...rest of the component logic
}
```

---

### Key Reasons for Avoiding `useEffect` Here

1. **Readability**:

   - Placing initialization logic inline with `useState` makes the code more readable. Readers can immediately understand that `pickedPlaces` is derived from `localStorage` and `AVAILABLE_PLACES`.

2. **Avoid Lifecycle Confusion**:

   - Using `useEffect` suggests there’s a lifecycle dependency, which isn’t the case here. The data is fully available before the component renders.

3. **Performance**:

   - By initializing state directly, We avoid unnecessary re-renders caused by `setState` in `useEffect`.

### Another use-case for `useEffect`

So far, we have managed the modal in an imperative way. Goal is to manage it in a declarative way.

`Modal.jsx`

```jsx
import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(function Modal({ children }, ref) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
      close: () => {
        dialog.current.close();
      },
    };
  });

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
});

export default Modal;
```

`App.jsx`

```jsx
import { useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // once the location has been fetched, the callback will be executed by the browser
  // browser gives us position object
  // SIDE EFFECT
  // 1) it's not related to rendering JSX code
  // 2) the callback function will be called in the future where the JSX code finished rendering
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
```

Remove the imperative code in `App.jsx`

`App.jsx`

```jsx
import { useEffect, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // once the location has been fetched, the callback will be executed by the browser
  // browser gives us position object
  // SIDE EFFECT
  // 1) it's not related to rendering JSX code
  // 2) the callback function will be called in the future where the JSX code finished rendering
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }

  return (
    <>
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
```

`Modal.jsx`

```jsx
import { useRef } from "react";
import { createPortal } from "react-dom";

const Modal = function Modal({ open, children }) {
  const dialog = useRef();

  // only by calling showModal method, the backdrop of the modal is added
  if (open) {
    dialog.current.showModal();
  } else {
    dialog.current.close();
  }

  return createPortal(
    <dialog className="modal" ref={dialog} open={open}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
```

The code above, an error happens: `TypeError: undefined is not an object (evaluating 'dialog.current.close')`

- During the initial render, `const dialog = useRef();` initializes `dialog.current` as `undefined`.
- The `useRef` reference (`dialog.current`) gets attached to the actual HTML `<dialog>` element only after React completes rendering.
- With useEffect, we can solve this problem

```jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = function Modal({ open, children }) {
  const dialog = useRef();

  useEffect(() => {
    // only by calling showModal method, the backdrop of the modal is added
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog} open={open}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
```

### Cleanup function

- A cleanup function of useEffect hook prevents running after a component is unmounted or before a new effect runs.
- useEffect can return a function, which React treats as the cleanup function.

#### Example 1 : `setTimeout`

```jsx // when the component disappears, we should stop the timer
// useEffect is not need for timer itself, but for cleaning the timer
useEffect(() => {
  // setTimeout starts when the app component is rendered (inside the App, DeleteConfirmation is also included)
  // a browser built-in function
  const timer = setTimeout(() => {
    // after 3 seconds, execute onConfirm
    onConfirm();
  }, 3000);

  return () => {
    console.log("Cleaning up timer");
    clearTimeout(timer);
  };
}, [onConfirm]);
```

#### Example 2 : `setInterval`

```jsx
useEffect(() => {
  // It defines a function that will be executed every couple of miliseconds.
  const interval = setInterval(() => {
    console.log("INTERVAL");
    setRemainingTime((prevTime) => prevTime - 10);
  }, 10);

  return () => {
    clearInterval(interval);
  };
}, []);
```

- a clean up funtion runs right before the effect function runs again or the component dismounts (removed from the DOM)
- NOTE : it doesn't run right before the effect function is executed for the first time.
- it runs before the subsequent executions of effect function and the component is removed from the DOM

### The problem with object & function dependencies

- When adding objects or functions as dependencies, there is a danger of creating an infinite loop
- A function, in JavaScript, is just a value, specifically an object.
- Whenever the component re-runs, the values defined in that component, are recreated.
- In JavaScript, the two objects with the same shape, or code, are not the same.

### The `useCallback` Hook

- It can make sure that the function used as dependencies is not recreated all the time.

#### Syntax

```jsx
const handleRemovePlace = useCallback(function handleRemovePlace() {
  setPickedPlaces((prevPickedPlaces) =>
    prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
  );
  setModalIsOpen(false);

  const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  localStorage.setItem(
    "selectedPlaces",
    JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
  );
}, []);
```

- first argument : a function used as dependencies
- second argument : an array of dependencies (a state or a prop used in that wrapped function)

- `useCallback` prevents the inner-function recreated, stores it internally in memory, and reuses the stored function whenever the component runs again.
- React will only recreate the function with `useCallback` if the dependencies changed
