import React from "react";
import EventForm from "../components/EventForm";
import { redirect } from "react-router";

function NewEventPage() {
  return <EventForm method="post" />;
}

export default NewEventPage;
