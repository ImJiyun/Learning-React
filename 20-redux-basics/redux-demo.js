const redux = require("redux"); // import 3rd party in node.js

// store should manage data
// data is determined by the reducer function
// bc reducer function will produce new state snapshots

// reducer function is a standard JS function but it will be called by Redux libarary
// 1st arg : existing state
// 2nd : dispatched action
// must return a new state object
// Reducer function should be a pure function - same input always leads to the same output
const counterReducer = (state = { counter: 0 }, action) => {
  // default property

  if (action.type === "increment") {
    return {
      counter: state.counter + 1,
    };
  }

  if (action.type === "decrement") {
    return {
      counter: state.counter - 1,
    };
  }
  return state;
};
// store needs to know which reducer is responsible for chaning that state
// create a store
const store = redux.createStore(counterReducer);

// subscription function will be triggered whenver the state changes
const counterSubscriber = () => {
  const latestState = store.getState(); // it will give us the latest state snapshot after it was updated
  console.log(latestState);
};

// subscribe method expects a function which Redux will execute for us whenver the data and the store changed
store.subscribe(counterSubscriber);
// we don't execute counterSubscriber here, we just point it
// both the reducer and subscriber function will be executed by Redux

store.dispatch({ type: "increment" }); // a method that dispatches an action
// an action is JS object that has type property as an identifier
// after dispatching a new action, the reducer function runs again
store.dispatch({ type: "decrement" });

// redux isn't limited for React
// it can be used for any JavaScript project