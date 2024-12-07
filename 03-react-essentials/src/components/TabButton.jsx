export default function TabButton({ children, onSelect, isSelected }) {
  // even if a dev doesn't set any attirbute, react will give a props object
  console.log("TAPBUTTON COMPONENT EXECUTING"); // by default, react components execute only once

  return (
    // className -> jsx, class -> regular html
    // set attribute conditionally
    <li>
      <button className={isSelected ? "active" : undefined} onClick={onSelect}>
        {children}
      </button>
    </li>
  ); // it's the value that's passed to the onClick prop, bc function should not be executed by dev, but instead react
  // if we include parentheses, the event will occur when the line of code gets executed
  // it should be executed when the event happens sbgtro don't include parentheses
}
// children prop : react automatically passes a special prop named "children" to every custom component
// content for "children" : the content between component opening and closing tags is used as a value for the special "children" prop

// using "children" prop
// for components that take "a single piece of renderable content", this approach is closer to "normal HTML usage"
// this approach is especially convenient when passing JSX code as a value to another component

// using attributes
// this approach makes sense if you got "multiple smaller pieces of information" that must be passed to a component
// adding extra props instead of just wrapping the content with the component tags mean extra work
