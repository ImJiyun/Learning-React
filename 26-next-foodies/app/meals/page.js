import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "../../components/meals/meals-grid";
import { getMeals } from "@/lib/meals";
import { Suspense } from "react";

// we can use async keyword with server components
// Meals component fetches data from the server
// Outsourcing the data fetching to a separate function
async function Meals() {
  // In next.js, we already have access to the database in the server components
  // so we don't need to fetch data in the client side and use useEffect

  // if the code return a promise, next.js will wait for the promise to resolve
  const meals = await getMeals();

  return <MealsGrid meals={meals} />;
}
export default function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{" "}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It is easy and fun
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense
          fallback={<p className={classes.loading}>Fetching meals...</p>}
        >
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
