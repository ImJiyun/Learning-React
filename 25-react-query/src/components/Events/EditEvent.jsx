import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    // React query passes a data which we passed to mutate
    onMutate: async (data) => {
      const newEvent = data.event;
      // cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["events", id] });
      // to rolll back, we need the currently stored data
      const previousEvent = queryClient.getQueryData(["events", id]);
      // 1st arg : key of the query we want to change
      // 2nd arg : the new data we want to store
      queryClient.setQueryData(["events", id], newEvent); // manipulate the stored data without waiting for a response
      return { previousEvent };
    },
    // if the mutation gets the error, onError will be executed
    // these objects are passed in automatically by React Query
    // context object can contain the returned value
    onError: (error, data, context) => {
      queryClient.setQueryData(["events", id], context.previousEvent);
    },
    // whenever the mutation finishes,
    onSettled: () => {
      queryClient.invalidateQueries(["events", id]); // fetch the latest data from the backend
    },
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate("../"); // go up one level, go the page the user is comming from
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            "Failed to load event. Please check your inputs and try again later"
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }
  return <Modal onClose={handleClose}>{content}</Modal>;
}
