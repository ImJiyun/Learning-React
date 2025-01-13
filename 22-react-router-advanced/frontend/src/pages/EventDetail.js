import {
  redirect,
  useLoaderData,
  useParams,
  useRouteLoaderData,
} from "react-router";
import EventItem from "../components/EventItem";

function EventDetailPage() {
  // const params = useParams();
  const data = useRouteLoaderData("event-detail");
  // works the same with useLoaderData but it takes route id

  return <EventItem event={data.event} />;
}

export default EventDetailPage;

export async function loader({ request, params }) {
  // react router passes the object into loader function, and the object has request and params property
  const id = params.eventId;
  const response = await fetch("http://localhost:8080/events/" + id);
  // react router would automatically wait for the promise and give us access to the data to which it resolves
  if (!response.ok) {
    throw new Response(
      JSON.stringify(
        { message: "Could not fetch details for selected event." },
        {
          status: 500,
        }
      )
    );
  } else {
    return response;
  }
}

export async function action({ params, request }) {
  const eventId = params.eventId;
  const response = fetch("http://localhost:8080/events/" + eventId, {
    method: request.method,
  });

  if (!response.ok) {
    throw new Response(
      JSON.stringify(
        { message: "Could not delete event." },
        {
          status: 500,
        }
      )
    );
  }
  return redirect("/events");
}
