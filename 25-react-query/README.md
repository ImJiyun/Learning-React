## Tanstack Query

### Definition

- A library that helps with sending HTTP requests & keeping frontend UI in sync
- We don't need it but it can vastly simplify the code, and gives advanced features like caching, data fetching
- Tanstack Query does NOT send HTTP requests

  - We have to write the code that sends the actual HTTP request
  - Tanstack Query then manages the data, errors, caching & much more

### How to use it?

- `useQuery` : a hook that sends an HTTP request and caches the data
- It returns an object with properties, like `data`, `isPending`, and `isError`
- Every query needs `queryKey`, an array which is stored by React Query
- `queryKey` will be used by React Query to cache the data, so that the response from that request could be reused in the future

```jsx
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
    queryKey: ["events"],
    // queryFn : the code that will send the request and return the data
    queryFn: fetchEvents,
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
```

- We must provide `QueryClientProvider` to the component where we want to use tanstack query

```jsx
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import Events from "./components/Events/Events.jsx";
import EventDetails from "./components/Events/EventDetails.jsx";
import NewEvent from "./components/Events/NewEvent.jsx";
import EditEvent from "./components/Events/EditEvent.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/events" />,
  },
  {
    path: "/events",
    element: <Events />,

    children: [
      {
        path: "/events/new",
        element: <NewEvent />,
      },
    ],
  },
  {
    path: "/events/:id",
    element: <EventDetails />,
    children: [
      {
        path: "/events/:id/edit",
        element: <EditEvent />,
      },
    ],
  },
]);

// configuraion object for the QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
```

### Cache and stale the data

- React Query caches response data, making it instantly available for future requests using the same queryKey.
- When `useQuery` is called with the same `queryKey`, React Query reuses the cached data, improving performance and reducing unnecessary network requests.
- While the cached data is used immediately, React Query may still send a background request to check for updated data, depending on the staleness of the data. If updated data is found, the cache and UI are automatically updated.
- Images are fetched and potentially cached by the browser itself. React and React Query are not involved in image caching or management.

```jsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ["events"],
  queryFn: fetchEvents,
  staleTime: 5000, // Data stays fresh for 5 seconds
  gcTime: 30000, // Data is garbage collected after 30 seconds
});
```

- `staleTime` (default: 0)

  - Defines how long the cached data is considered fresh.
  - During this period, React Query won't refetch the data when a component remounts or when the window is refocused.
  - After `staleTime` expires, the data becomes stale, and a background refetch may occur.
  - Setting a higher `staleTime` reduces the frequency of network requests.

- `gcTime` (Garbage Collection Time, default: 5 minutes)

  - Determines how long inactive cached data is kept in memory before being garbage collected.
  - If no component is using the data and the `gcTime` elapses, React Query will remove it from the cache.
  - Longer `gcTime` values help reduce refetching if users frequently revisit the same data.

### Dynamic query functions & query keys

- We can make `fetchEvents` method more reusable, to use both cases, one for fetching all data, the other for fetching data based on searchTerm

```javascript
export async function fetchEvents(searchTerm) {
  let url = "http://localhost:3000/events";

  if (searchTerm) {
    url += `?search=${searchTerm}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
```

- By constructing a query key dynamically, React Query can cache (and reuse) different data for different keys based on the same query
- Using a ref as a queryKey is not a good idea - It will not cause re-rendering, so when the input value changes, the query is not updated and not sent again

```jsx
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.js";

export default function FindEventSection() {
  const searchElement = useRef();

  // the query wants the event data that matches the search term
  useQuery({
    queryKey: ["events", { search: searchElement.current.value }],
    // use arrow function, so that the function is not executed immediately
    queryFn: () => fetchEvents(searchElement.current.value),
  });

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      <p>Please enter a search term and to find events.</p>
    </section>
  );
}
```

- Instead, use state

```jsx
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.js";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  // the query wants the event data that matches the search term
  useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: () => fetchEvents(searchTerm),
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      <p>Please enter a search term and to find events.</p>
    </section>
  );
}
```

### Query Configuration Object & Aborting Requests

- React Query passes Query Configuration Object to the `queryFn` in `useQuery`
- This object contains properties like `signal`, which is used to abort ongoing requests when necessary

```javascript
export async function fetchEvents({ signal, searchTerm }) {
  let url = "http://localhost:3000/events";

  if (searchTerm) {
    url += `?search=${searchTerm}`;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
```

```jsx
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  // the query wants the event data that matches the search term
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: ({ signal }) => fetchEvents(signal, searchTerm),
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occured"
        message={error.info?.message || "Failed to fetch events"}
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
```

### Enabled & Disabled Queries

- We might want some requests not to be sent instantly
- Set `enabled` property to be `false` not to send the request instantly

```jsx
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();

  // the query wants the event data that matches the search term
  // react query treats isPending as true unless the query is enabled
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: ({ signal }) => fetchEvents(signal, searchTerm),
    enabled: searchTerm !== undefined,
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occured"
        message={error.info?.message || "Failed to fetch events"}
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
```

- If we don't enter `searchTerm`, the request will not be sent
- The code above has a problem: react query treats `isPending` as `true` unless the query is enabled
- the loading indicator is visible, but this is not what we want

```jsx
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();

  // the query wants the event data that matches the search term
  // react query treats isPending as true unless the query is enabled
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: ({ signal }) => fetchEvents(signal, searchTerm),
    enabled: searchTerm !== undefined,
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occured"
        message={error.info?.message || "Failed to fetch events"}
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
```

- `isLoading` will not be true when the query is just disabled

### Changing data with Mutations

- To send a POST request, use `useMutation`, as the hook is opitimzed
- We can of course use `useQuery`, but with `useMutation`, **the requests are not send instantly when the component renders**, which is the default behavior of `useQuery`
- It takes a configuration object wih properities like `mutiationFn`, `mutationKey`
- `mutationKey` is not neccessary, POST requests are about modifying data, caching the response isn’t typical, unlike with useQuery.

```jsx
import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed to create event. Please check your inputs and try again later"
          }
        />
      )}
    </Modal>
  );
}
```

- `useMutation` returns an object with properties like `mutate`
- `mutate` is a function which we can call to send the request

### Acting on Mutation Success & Invalidating Queries

- the function in `onSuccess` will be executed once the mutation succeeds
- It allows us to perform side effects, such as navigation, showing success messages, or triggering data refetches.
- After the POST request, we want to refetch existing data to reflect the changes. (need to invalidate the queries)

```jsx
import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      // invalidate the events query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed to create event. Please check your inputs and try again later"
          }
        />
      )}
    </Modal>
  );
}
```

- `queryClient.invalidateQueries `marks specific queries as "stale", prompting React Query to refetch them the next time they are accessed.
