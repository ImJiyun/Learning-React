import { sortPlacesByDistance } from "./loc";

export async function fetchAvailablePlaces(params) {
  // fetch function itself throws an error if the request fails
  // so it need to be wrapped in try-catch block
  const respone = await fetch("http://localhost:3000/places");
  const resData = await respone.json();

  // handling errors
  if (!respone.ok) {
    // 400, 500 status codes
    throw new Error("Failed to fetch places.");
    // throwing error will stop the execution of the function
  }

  return resData.places;
}

export async function updateUserPlaces(places) {
  const response = await fetch("http://localhost:3000/user-places", {
    method: "PUT",
    body: JSON.stringify({ places }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to update user places.");
  }

  return resData.message;
}

export async function fetchUserPlaces() {
  // fetch function itself throws an error if the request fails
  // so it need to be wrapped in try-catch block
  const respone = await fetch("http://localhost:3000/user-places");
  const resData = await respone.json();

  // handling errors
  if (!respone.ok) {
    // 400, 500 status codes
    throw new Error("Failed to fetch user places.");
    // throwing error will stop the execution of the function
  }

  return resData.places;
}
