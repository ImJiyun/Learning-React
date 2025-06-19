"use server";
import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

// this creates 'Server Action'

export async function shareMeal(formData) {
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

  console.log(meal);
  // store database
  await saveMeal(meal);
  redirect("/meals");
}
