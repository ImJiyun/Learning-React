import { Link, useSubmit } from "react-router";
import classes from "./EventItem.module.css";

function EventItem({ event }) {
  const submit = useSubmit(); // it gives us submit function

  function startDeleteHandler() {
    const proceed = window.confirm("Are you sure?"); // returns true or false

    if (proceed) {
      submit(null, { method: "delete" }); // data
    }
  }

  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />
      <h1>{event.title}</h1>
      <time>{event.date}</time>
      <p>{event.description}</p>
      <menu className={classes.actions}>
        <Link to="edit">Edit</Link>
        <button onClick={startDeleteHandler}>Delete</button>
      </menu>
    </article>
  );
}

export default EventItem;
