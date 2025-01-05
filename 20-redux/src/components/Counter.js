import classes from "./Counter.module.css";

import { counterActions } from "../store/counter.js";
import { useSelector, useDispatch } from "react-redux";
// useSelector is a custom hook made by the React Redux team
// is used to extract piece of data from store

const Counter = () => {
  const dispatch = useDispatch(); // dispatch here is a function which will dispatch an action against redux store

  const counter = useSelector((state) => state.counter.counter); // callback function will be executed by react redux
  // when using selector, react redux will automatically set up a subscription to redux store for this component
  // component will be updated and will receive the latest counter automatically whenever that data changes in the Redux store
  // if the component is unmounted or removed from the DOM, react redux will also automatically clear the subscription

  const show = useSelector((state) => state.counter.showCounter);

  const incrementHandler = () => {
    // need to dispatch an action with type property
    dispatch(counterActions.increment());
  };

  // attaching payloads to action
  const increaseHandler = () => {
    dispatch(counterActions.increase(10)); // { type : SOME_UNIQUE_IDENTIFIER, payload : 10 }
  };

  const decrementHandler = () => {
    dispatch(counterActions.decrement());
  };

  const toggleCounterHandler = () => {
    dispatch(counterActions.toggleCounter());
  };

  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      {show && <div className={classes.value}>{counter}</div>}
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={increaseHandler}>Increment by 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter;
