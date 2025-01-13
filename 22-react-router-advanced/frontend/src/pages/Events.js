import { useLoaderData, json } from "react-router-dom";
// a hook that can access the closest loader data

import EventsList from "../components/EventsList";

function EventsPage() {
  // asyc and await will return a promise but React Router will check if a promise is returned
  // and get the resolved data from that promise
  const data = useLoaderData();

  if (data.isError) {
    return <p>{data.message}</p>;
  }

  const events = data.events;

  return <EventsList events={events} />;
}

export default EventsPage;

// loader code will not execute on a server
// this is all happening in the browser
// even though it's not a component, it's still in the browser
export async function loader() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // return { isError: true, message: "Could not fetch events." };
    throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
      status: 500,
    });

    // return json({ message: "Could not fetch events." }, { status: 500 });
    // json is only available when using React Router v6, creates a response object that includes data in json format
    // when an error gets thrown in a loader, React router will render the closest error element
  } else {
    //  const resData = await response.json();
    // return resData.events; // react router will make this retured data available in this page
    // const res = new Response("any data", { status: 201 }); // built-in browser object
    return response;
  }
}
