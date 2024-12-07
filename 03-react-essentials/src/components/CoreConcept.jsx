// summary
// props are "custom HTML attributes" set on components
// react merges all props into a single object
// props are passed to the component function as the first argument by React
export default function CoreConcept({ image, title, description }) {
  // the value that will be passed for this parameter to this function by react will be an object, and it will be an object that has key value pairs
  return (
    // <li>
    //   <img src={props.image} alt={props.title} />
    //   <h3>{props.title}</h3>
    //   <p>{props.description}</p>
    // </li>
    <li>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}
