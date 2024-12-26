import { useState, memo, useCallback, useMemo } from "react";

// memo is wrapping the component function
// useMemo is wrapping the noraml function that is called inside of the component to prevent normal function to be executed every time the component gets rendered
// use useMemo only when the function is expensive to run
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
