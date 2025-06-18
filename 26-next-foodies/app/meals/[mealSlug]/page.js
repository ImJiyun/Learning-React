import Image from "next/image";
import classes from "./page.module.css";
import { getMeal } from "@/lib/meals";
import { notFound } from "next/navigation";

// localhost:3000/meals/dfsa
// every component in page.js receives a params object
// params object contains an object with the dynamic segments of the URL
// key is the name of file, the value is the actual url segment
export default async function MealDetailsPage({ params }) {
  const { mealSlug } = await params;

  const meal = getMeal(mealSlug);

  if (!meal) {
    notFound();
    // This will stop the execution of the function and show the closest 404 page
  }

  meal.instructions = meal.instructions.replace(/\n/g, "<br />");

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        {/* if we're not validating it, cross-site scripting attacks would take occur */}
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{ __html: meal.instructions }}
        ></p>
      </main>
    </>
  );
}
