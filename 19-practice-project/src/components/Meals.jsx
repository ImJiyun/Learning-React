import { useEffect, useState } from "react";
import MealItem from "./MealItem";

export default function Meals() {
  const [loadedMeals, setLoadedMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      // await needs to be in an async function
      const response = await fetch("http://localhost:3000/meals");

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const meals = await response.json(); // convert JSON to JavaScript object
      setLoadedMeals(meals);
    }

    fetchMeals();
  }, []); // in this case, useEffect doesn't use external state, props, or context, so we can pass an empty array
  // useEffect runs side effect after component renders

  // fetching data from backend takes time, so the data is not available immediately
  // so we need to render a UI without the data, and then update the UI when the data is available
  // once the data is available, we can update the UI by adding the meals to the list
  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
