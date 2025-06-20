"use server";
import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

// this creates 'Server Action'

export async function shareMeal(prevState, formData) {
  // automatically recieve formData
  // Components, by default, are server component
  // to make function running on server, put 'use server'
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    // throwing an error would be one way to handle invalid input
    // but it would not be user-friendly, it can't hold the form data
    // throw new Error("Invalid input - all fields are required!");
    // server actions can return an object (Serializable)
    return {
      message: "Invalid input",
    };
  }

  console.log(meal);

  // store database
  await saveMeal(meal);
  // trigger cache revalidation
  // this will revalidate the meals cache, so that the new meal is available immediately
  revalidatePath("/meals"); // by default, it will revalidate the current path. not nested paths
  // layout option can be used to revalidate the nested paths as well
  redirect("/meals");
}
