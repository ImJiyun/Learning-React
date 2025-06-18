import sql from "better-sqlite3";

const db = sql("meals.db"); // Initialize the database connection

// sqlite3 is a synchronous library, so we can use it directly without async/await
// but we can use async/await in Next.js server components
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay for demonstration

  // throw new Error("Loading meals failed"); // Simulate an error for testing purposes
  // run is used for insering data, updating data, deleting data
  // all is used for fetching data
  // get is used for fetching a single row
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  // db.prepare("SELECT * FROM meals WHERE slug = " + slug).get(); // would lead to SQL injection
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug); // Fetch a single meal by slug (dynamic parameter binding)
}
