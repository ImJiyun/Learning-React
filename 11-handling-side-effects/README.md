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

1. **Purpose**: Allows you to handle side effects in functional components.
    
2. **First Argument**: A function containing the side effect code.
    
3. **Second Argument**: Dependency array, which controls when the effect runs.
	    `useEffect(() => {
		  // Side effect code
		}, [dependencies]);
`
4. **Execution Timing**:
    
    - The effect function runs after the component renders.
    - React skips re-execution unless one of the dependencies has changed.

#### **Correcting Infinite Loops**

- Without `useEffect`, state updates can lead to infinite re-renders.
    
- Adding an empty dependency array (`[]`) ensures the side effect runs only once after the initial render.
    
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

- Lists variables or state values that the effect depends on.
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

#### Example: `handleSelectPlace`

Here's a detailed breakdown of why this example doesn't need `useEffect`:

---

### Code Analysis

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
    
    - You cannot use `useEffect` inside a nested function (e.g., inside `handleSelectPlace`). Hooks are only valid at the top level of a component or custom Hook.
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
    
    - By initializing state directly, you avoid unnecessary re-renders caused by `setState` in `useEffect`.
