import fs from "node:fs"; // work with file system

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

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

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extenstion = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extenstion}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(
    Buffer.from(bufferedImage, (error) => {
      if (error) {
        throw new Error("Saving image failed");
      }
    })
  );

  meal.image = `/images/${fileName}`; // the path shouldn't include public/

  // prevent sql injection
  db.prepare(
    `
    INSERT INTO meals 
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)  
    `
  ).run(meal);
}
