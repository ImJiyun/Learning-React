import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
  // useQuery : a hook that sends an HTTP request and caches the data
  // useQuery returns an object with data, isPending, and isError properties
  const { data, isPending, isError, error } = useQuery({
    // queryKey : the key that will be used to cache the data
    queryKey: ["events", { max: 3 }],
    // queryFn : the code that will send the request and return the data
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
    staleTime: 5000,
    // gcTime: 30000,
  }); // sends HTTP request to fetch events and returns the data, loading state, and error state

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Faild to fetch events"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
