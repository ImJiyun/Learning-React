### Data Fetching with `loader`

- So far, we have loaded entire component before sending a HTTP reqeust to backend

```jsx
import { useEffect, useState } from "react";

import EventsList from "../components/EventsList";

function EventsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedEvents, setFetchedEvents] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/events");

      if (!response.ok) {
        setError("Fetching events failed.");
      } else {
        const resData = await response.json();
        setFetchedEvents(resData.events);
      }
      setIsLoading(false);
    }

    fetchEvents();
  }, []);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
      {!isLoading && fetchedEvents && <EventsList events={fetchedEvents} />}
    </>
  );
}

export default EventsPage;
```

- It would be nicer if React Router would initiate data fetching as sonn as we start navigating to the page
- So, fetching data first and then rendering component

- React Router gives us to add `loader` property in route definition

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: async () => {
              const response = await fetch("http://localhost:8080/events");

              if (!response.ok) {
              } else {
                const resData = await response.json();
                return resData.events;
              }
            },
          },
          { path: ":eventId", element: <EventDetailPage /> },
          { path: "new", element: <NewEventPage /> },
          { path: ":eventId/edit", element: <EditEventPage /> },
        ],
      },
    ],
  },
]);
```

- It takes a function as a value, which will be executed by React whenever we are about to visit that route
- React Router take the value returned from the `loader`, and will make the data available in that page

### Accessing data from `loader`

- With `useLoaderData` hook, we can get access to the **closest** `loader` data

```jsx
import { useLoaderData } from "react-router";
import EventsList from "../components/EventsList";

function EventsPage() {
  const events = useLoaderData(); // can access to the closest loader data
  // events = data returned from the loader

  return <EventsList events={events} />;
}

export default EventsPage;
```

- React Router will check if a promise is returned and get the resolved data
- NOTE : We can use `useLoaderData` hook in the element assigned to a route AND in all components used inside that element

### Where should `loader` code be stored?

- Common pattern is to store the loader code in the component which needs it

`EventsPage.js`

```jsx
import { useLoaderData } from "react-router";
import EventsList from "../components/EventsList";

function EventsPage() {
  const events = useLoaderData(); // can access to the closest loader data
  // data returned from the loader

  return <EventsList events={events} />;
}

export default EventsPage;

export async function eventsLoader() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
  } else {
    const resData = await response.json();
    return resData.events;
  }
}
```

`App.js`

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          { path: ":eventId", element: <EventDetailPage /> },
          { path: "new", element: <NewEventPage /> },
          { path: ":eventId/edit", element: <EditEventPage /> },
        ],
      },
    ],
  },
]);
```

- Now the code satisfies the separation of concerns and gets leaner
- NOTE : loader functions are on client side code, so we can use any browser API - `localStorge`, `fetch`...
- But, they are not a component, so React hooks can not be placed inside loader functions

### When the loader functions are executed?

- The loader for a page will be called right when we start navigating to that page
- NOT after the page component has been rendered
- React Router will wait for the data to be fetched and then renders the page with it
- PROS
  - We don't have to worry if the data is fetched, because rendered pages mean the data is there
- CONS
  - It might delay the rendering, so the user experience might be bad

### Reflecting the current navigation state in the UI

- `useNavigation` is a hook which tells us whether we're in an active transition if we're loading data
- `useNavigation` returns a navigation object
- navigation object has multiple properties - `state`
- `state` has three data - `idle`, `loading`, `submitting`

```jsx
import { Outlet, useNavigation } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

function RootLayout() {
  const navigation = useNavigation();

  return (
    <>
      <MainNavigation />
      <main>
        {navigation.state === "loading" && <p>Loading...</p>}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
```

### Returning responses in loader()s

```jsx
import { useLoaderData } from "react-router";
import EventsList from "../components/EventsList";

function EventsPage() {
  const data = useLoaderData(); // can access to the closest loader data
  const events = data.events;

  return <EventsList events={events} />;
}

export default EventsPage;

export async function eventsLoader() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // error handling
  } else {
    return response;
  }
}
```

- React Router internally processes the value returned by the loader.
- If the loader returns a Response object, React Router automatically calls `response.json()` to parse the JSON data before passing it to `useLoaderData()`.
- So we don't have to call `response.json()` in the `loader`

### Error Handling with Custom Errors

#### 1. Returning data indicating there is an error

```jsx
import { useLoaderData } from "react-router";
import EventsList from "../components/EventsList";

function EventsPage() {
  const data = useLoaderData(); // can access to the closest loader data

  if (data.isError) {
    return <p>{data.message}</p>;
  }
  const events = data.events;

  return <EventsList events={events} />;
}

export default EventsPage;

export async function eventsLoader() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // error handling
    return { isError: true, message: "Could not fetch events" };
  } else {
    return response;
  }
}
```

#### 2. Throwing an error

```jsx
import { useLoaderData } from "react-router";
import EventsList from "../components/EventsList";

function EventsPage() {
  const data = useLoaderData(); // can access to the closest loader data

  const events = data.events;

  return <EventsList events={events} />;
}

export default EventsPage;

export async function eventsLoader() {
  const response = await fetch("http://localhost:8080/events`");

  if (!response.ok) {
    // error handling
    throw { message: "Could not fetch events" };
  } else {
    return response;
  }
}
```

- When an error gets thrown in a loader, React Router will render the closest `errorElement`
- So `errorElement` is used :
  - When user enters invalid route paths
  - When an error is generated

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          { path: ":eventId", element: <EventDetailPage /> },
          { path: "new", element: <NewEventPage /> },
          { path: ":eventId/edit", element: <EditEventPage /> },
        ],
      },
    ],
  },
]);
```

### Extracting Error Data & Throwing Responses

- We might want to differenciate 400 error and 500 error

```jsx
import { useLoaderData } from "react-router";
import EventsList from "../components/EventsList";

function EventsPage() {
  const data = useLoaderData(); // can access to the closest loader data

  const events = data.events;

  return <EventsList events={events} />;
}

export default EventsPage;

export async function eventsLoader() {
  const response = await fetch("http://localhost:8080/events`");

  if (!response.ok) {
    // error handling
    throw new Response(JSON.stringify({ message: "Could not fetch events" }), {
      status: 500,
    });
  } else {
    return response;
  }
}
```

- With help of `Response` constructor, we can specify status code.

#### Generic error page

```jsx
import { useRouteError } from "react-router";
import PageContent from "../components/PageContent";
import MainNavigation from "../components/MainNavigation";

function ErrorPage() {
  const error = useRouteError();

  let title = "An errror occurred!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = JSON.parse(error.data).message;
  }

  // default status set by React Router if the user enter a path not supported
  if (error.status === 404) {
    title = "Not Found!";
    message = "Could not find resource or page.";
  }

  return (
    <>
      <MainNavigation />
      <PageContent title={title}>
        .<p>{message}</p>
      </PageContent>
    </>
  );
}

export default ErrorPage;
```

- `useRouteError` is a hook in which we can get access the error information
- When throwing a `Response` object, React Router can catch it and pass it directly to `useRouteError`, allowing error boundary components to access structured error information (like status codes and messages) easily.

### json() utility function (React Router version 6)

- `json` is a function that creates a response object that includes data in json format

```jsx
import { useLoaderData } from "react-router";
import EventsList from "../components/EventsList";
import { json } from "react-router-dom";

function EventsPage() {
  const data = useLoaderData(); // can access to the closest loader data

  // if (data.isError) {
  //   return <p>{data.message}</p>;
  // }

  const events = data.events;

  return <EventsList events={events} />;
}

export default EventsPage;

export async function eventsLoader() {
  const response = await fetch("http://localhost:8080/events`");

  if (!response.ok) {
    // error handling
    // return { isError: true, message: "Could not fetch events" };
    // throw new Response(JSON.stringify({ message: "Could not fetch events" }), {
    //   status: 500,
    // });
    return json({ message: "Could not fetch events" }, { status: 500 });
  } else {
    return response;
  }
}
```

- We need to pass the data that should be included in the response
- We don't need to convert the data to json manually

- We don't have to parse the json format manually in the place where the data is used

```jsx
import { useRouteError } from "react-router";
import PageContent from "../components/PageContent";
import MainNavigation from "../components/MainNavigation";

function ErrorPage() {
  const error = useRouteError(); // can access the

  let title = "An errror occurred!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = error.data.message;
  }

  // default status set by React Router if the user enter a path not supported
  if (error.status === 404) {
    title = "Not Found!";
    message = "Could not find resource or page.";
  }

  return (
    <>
      <MainNavigation />
      <PageContent title={title}>
        .<p>{message}</p>
      </PageContent>
    </>
  );
}

export default ErrorPage;
```

### Dynamic Routes & loader()s

- We want to get the specific id of the event to fetch the event detail data

`EventDetail.js`

```jsx
import { useParams } from "react-router";
import EventItem from "../components/EventItem";

function EventDetailPage() {
  const params = useParams();
  return <EventItem />;
}

export default EventDetailPage;

export async function eventDetailLoader({ request, params }) {
  // how we can get the id in the loader
  // we can't use useParams hook - hooks can't be used in loader
  // React Router passes an object
  // params contains the route parameters
  const id = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw new Response(
      JSON.stringify({
        message: "Could not fetch details for the selected event.",
      }),
      { status: 500 }
    );
  } else {
    return response;
  }
}
```

- `useParams` can't be used in the loader as hooks can NOT be used in it
- React Router passes an object into loader function
- It has two value - `request`, `params`
- `params` contains the route parameters

`App.js`

- We must register the loader in the route definition

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import EventsPage, { eventsLoader } from "./pages/Events";
import EventDetailPage, { eventDetailLoader } from "./pages/EventDetail";
import NewEventPage from "./pages/NewEvent";
import EditEventPage from "./pages/EditEvent";
import EventsRootLayout from "./pages/EventsRoot";
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          {
            path: ":eventId",
            element: <EventDetailPage />,
            loader: eventDetailLoader,
          },
          { path: "new", element: <NewEventPage /> },
          { path: ":eventId/edit", element: <EditEventPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

Now getting back to `EventDetailPage`, we can get access data by using `useLoaderData`

```jsx
import { useLoaderData, useParams } from "react-router";
import EventItem from "../components/EventItem";

function EventDetailPage() {
  const data = useLoaderData();

  return <EventItem event={data.event} />;
}

export default EventDetailPage;

export async function eventDetailLoader({ request, params }) {
  // how we can get the id in the loader
  // we can't use useParams hook - hooks can't be used in loader
  // React Router passes an object
  // params contains the route parameters
  const id = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw new Response(
      JSON.stringify({
        message: "Could not fetch details for the selected event.",
      }),
      { status: 500 }
    );
  } else {
    return response;
  }
}
```

### `useRouteLoaderData` hook & accessing data from other routes

- To edit the event detail in `EditEventPage`, we need the same loader as the one in `EventDetailPage`

`EditEvent.js`

```jsx
import EventForm from "../components/EventForm";

function EditEventPage() {
  return <EventForm />;
}

export default EditEventPage;
```

- We can use the nested routes to share a `loader` between routes

`App.js`

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import EventsPage, { eventsLoader } from "./pages/Events";
import EventDetailPage, { eventDetailLoader } from "./pages/EventDetail";
import NewEventPage from "./pages/NewEvent";
import EditEventPage from "./pages/EditEvent";
import EventsRootLayout from "./pages/EventsRoot";
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          {
            path: ":eventId",
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <EventDetailPage />,
              },
              { path: "edit", element: <EditEventPage /> },
            ],
          },
          { path: "new", element: <NewEventPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

- Keep in mind that we can access loader data with `useLoaderData` hook in any component on the same or lower level than the the route where it is defined

```jsx
import { useLoaderData } from "react-router";
import EventForm from "../components/EventForm";

function EditEventPage() {
  const data = useLoaderData();

  return <EventForm event={data.event} />;
}

export default EditEventPage;
```

- However this code will cause a error
- To prevent it, instead use `useRouteLoaderData`

`App.js`

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import EventsPage, { eventsLoader } from "./pages/Events";
import EventDetailPage, { eventDetailLoader } from "./pages/EventDetail";
import NewEventPage from "./pages/NewEvent";
import EditEventPage from "./pages/EditEvent";
import EventsRootLayout from "./pages/EventsRoot";
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          {
            path: ":eventId",
            id: "event-detail",
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <EventDetailPage />,
              },
              { path: "edit", element: <EditEventPage /> },
            ],
          },
          { path: "new", element: <NewEventPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

`EditEvent.js`

```jsx
import { useRouteLoaderData } from "react-router";
import EventForm from "../components/EventForm";

function EditEventPage() {
  const data = useRouteLoaderData("event-detail");

  return <EventForm event={data.event} />;
}

export default EditEventPage;
```

- `useRouteLoaderData()` is a hook that works exactly like `useLoaderData()`, but it takes the `id` in route definition

### Working with `action()` functions

- With React Router, we can use `action()` functions to send a request to backend

- When handling form submittions, put `name` attribute the `input`, React Router will help us to extract data
- Use `Form` component provided by react-router-dom, it will take the default behavior of sending a request to the backend and give it to `action` function
  - The data will have all the data submmitted as part of the form
- It will trigger the action function of the currently active route
- with `action` prop, we can specify the path

```jsx
import { useNavigate } from "react-router-dom";

import classes from "./EventForm.module.css";

function EventForm({ method, event }) {
  const navigate = useNavigate();
  function cancelHandler() {
    navigate("..");
  }

  return (
    <Form method="post" className={classes.form}>
      <p>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={event ? event.title : ""}
        />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="url"
          name="image"
          required
          defaultValue={event ? event.image : ""}
        />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          required
          defaultValue={event ? event.date : ""}
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          required
          defaultValue={event ? event.description : ""}
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler}>
          Cancel
        </button>
        <button>Save</button>
      </div>
    </Form>
  );
}

export default EventForm;
```

Add `action` in route definition

`App.js`

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          {
            path: ":eventId",
            id: "event-detail",
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <EventDetailPage />,
              },
              { path: "edit", element: <EditEventPage /> },
            ],
          },
          { path: "new", element: <NewEventPage />, action: newEventAction },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

`NewEvent.js`

- Put the `action` code close to the components to which it belongs

```jsx
import { redirect } from "react-router";
import EventForm from "../components/EventForm";

function NewEventPage() {
  return <EventForm />;
}

export default NewEventPage;

// client side code
export async function newEventAction({ request, params }) {
  // can access any broswer API
  const data = await request.formData(); // give us form data

  // get access the input values
  const eventData = {
    title: data.get("title"),
    image: data.get("image"),
    date: data.get("date"),
    description: data.get("description"),
  };

  const response = fetch("http://localhost:8080/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not save event." }), {
      status: 500,
    });
  }
  // creates a response object that redirects the user to a different page
  return redirect("/events");
}
```

- action will be executed by react router and recieves an object which has `request` and `params` properties
  - `request` has formData() method in which we can get the form data
- with get() method, we can get `input` values (we must set the `name` properties)

### Submitting data programmatically
