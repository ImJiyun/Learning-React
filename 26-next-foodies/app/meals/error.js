"use client";

// Error component must be a client component so that it can handle errors in the client-side rendering
export default function Error({ error }) {
  // next.js will pass the error object to this component
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>Failed to fetch meal data. Please try again later.</p>
    </main>
  );
}
