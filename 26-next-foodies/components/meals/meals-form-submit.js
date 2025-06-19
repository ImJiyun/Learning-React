"use client";
import { useFormStatus } from "react-dom";

// we don't want the entire page to be client component, so it's better to sperate files
export default function MealsFormSubmit() {
  const { pending } = useFormStatus(); // require client component

  return (
    <button disabled={pending}>
      {pending ? "Submitting..." : "Share Meal"}
    </button>
  );
}
