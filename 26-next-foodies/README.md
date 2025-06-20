## Next

### Header Component

```js
import Link from "next/link";
import logoImg from "@/assets/logo.png";

export default function MainHeader() {
  return (
    <header>
      <Link href="/">
        {/* imported image in Next.js will be an object where the image is then stored under src property */}
        <img src={logoImg.src} alt="A plate with food on it" />
        NextLevel Food
      </Link>

      <nav>
        <ul>
          <li>
            <Link href="/meals">Browse Meals</Link>
          </li>
          <li>
            <Link href="/community">Foodies Community</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

#### Why is the image an object?

- when importing a static image in Next.js, it is handled as an object.
- This contains a `src` property with the image URL, along with additionial metadata such as `width` and `height`

### Styling Next.js - CSS

```js
import Link from "next/link";
import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";

export default function MainHeader() {
  return (
    <header className={classes.header}>
      <Link className={classes.logo} href="/">
        {/* imported image in Next.js will be an object where the image is then stored under src property */}
        <img src={logoImg.src} alt="A plate with food on it" />
        NextLevel Food
      </Link>

      <nav className={classes.nav}>
        <ul>
          <li>
            <Link href="/meals">Browse Meals</Link>
          </li>
          <li>
            <Link href="/community">Foodies Community</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

- In Next.js (React as well), CSS can be scoped to specific components by using CSS Modules, which are defined in files with the naming convention `[component].module.css`
- How this works? : when importing `[component].module.css`, the CSS class names are automatically converted into unique, hashed class names to prevent conflicts

### Optimizing Images with the NextJS Image Component

`Image` component provides built-in image optimization features

- 1. Next.js automatically serve images in mordern formats like WebP
- 2. Next.js by default load images lazily (by setting `priority` property, we can disables lazy loading)

### React Server Components vs Client Components

1. Vanilla React Apps Render On the Client

- The visible content is generated & rendered on the client-side (by the client-side React code)

2. In Next.js, Server- & client-side working together

- The backend executes the server component functions & hence derives the to-be-rendered HTML code
- The client-side receives & renders the to-be-rendered HTML code

1. React Server Components

- components that are only rendered on the server
- By default, all React components (in Next.js apps) are RSCs
- Advantage: Less client-side JS, great for SEO (web search crawlers now see pages that contain the complete finished content)

2. Client Components

- components that are pre-rendered on the server but then also potentially on the client
- opt-in via "use client" directive
- Advantage : client-side interactivity

### Use client components efficiently

```js
"use client";

import Link from "next/link";
import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";
import Image from "next/image";
import MainHeaderBackground from "./main-header-background";
import { usePathname } from "next/navigation";

export default function MainHeader() {
  const path = usePathname(); // this hook gives us the current path
  // usePathname requires "use client" at the top of the file

  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          {/* The image should be loaded right away in this case */}
          <Image src={logoImg} alt="A plate with food on it" priority />
          NextLevel Food
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              <Link
                href="/meals"
                className={
                  path.startsWith("/meals") ? classes.active : undefined
                }
              >
                Browse Meals
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className={
                  path.startsWith("/community") ? classes.active : undefined
                }
              >
                Foodies Community
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
```

- The code above works, but it's the best practice to write less client components as much as we can
- So that, we won't lose the advantages of server components (better SEO)

```js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./nav-link.module.css";

export default function NavLink({ href, children }) {
  const path = usePathname(); // this hook gives us the current path
  // usePathname requires "use client" at the top of the file

  return (
    <Link
      href={href}
      className={
        path.startsWith(href)
          ? `${classes.link} ${classes.active}`
          : classes.link
      }
    >
      {children}
    </Link>
  );
}
```

```js
import Link from "next/link";
import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";
import Image from "next/image";
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          {/* The image should be loaded right away in this case */}
          <Image src={logoImg} alt="A plate with food on it" priority />
          NextLevel Food
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              {/* we can use client component inside server component */}
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Foodies Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
```

### Connect with database

- We will use database to fetch and save data
- When we use Image component in Next.js, it needs to know the width and height of the image
- But we will load data from database, so it will be loaded dynamically
- `fill` attribute tells NextJs that it should fill the available space with image as defined by its parent components

```js
import Link from "next/link";
import Image from "next/image";

import classes from "./meal-item.module.css";

export default function MealItem({ title, slug, image, summary, creator }) {
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={image} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          {/* slug = dynamically routed page */}
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}
```

- For database, we will use SQLite
  - SQLite is a lightweight, file-based SQL database
  - It doesn't require a separate server and runs entirely from a single .db file
  - It's fast and simple to set up, making it ideal for small projects or local development
  - For high-traffic or data-intensive services, better to use PostgreSQL or MySQL instead

#### initialize database

`@/initdb.js`

##### 1. Import the SQLite library and connect to the database

```js
const sql = require("better-sqlite3");
const db = sql("meals.db");
```

- Loads the `better-sqlite3` library
- Opens (or creates) a SQLite database file named `meals.db`

##### 2. Define Sample Data (`dummyMeals`)

```js
const dummyMeals = [ { title: ..., slug: ..., ... }, ... ];
```

- This array contains **sample meal data**

##### 3. Create the `meals` table

```js
db.prepare(
  `
   CREATE TABLE IF NOT EXISTS meals (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug TEXT NOT NULL UNIQUE,
       title TEXT NOT NULL,
       image TEXT NOT NULL,
       summary TEXT NOT NULL,
       instructions TEXT NOT NULL,
       creator TEXT NOT NULL,
       creator_email TEXT NOT NULL
    )
`
).run();
```

- This creates the `meals` table with columns

##### 4. Insert the sample data

```js
async function initData() {
  const stmt = db.prepare(`
      INSERT INTO meals VALUES (
         null,
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
      )
   `);

  for (const meal of dummyMeals) {
    stmt.run(meal);
  }
}
```

- Prepares a SQL statement to insert data into the `meals` table
- Iterates over each `meal` in `dummyMeals` and inserts it
- `null` is used for the `id` field so it auto-generates

##### 5. Run the insertion

```js
initData();
```

- This line calls the `initData()` function to populate the database.

##### How to run it:

```bash
node initdb.js
```

> After that, SQLite database will be ready to use in Next.js backend.

#### Fetch data

`@/lib/meals.js`

```ts
import sql from "better-sqlite3";
```

- Imports the `better-sqlite3` module, which is a **synchronous** SQLite library that works well with small projects

```ts
const db = sql("meals.db");
```

- Opens the SQLite database file named `meals.db`
- If the file doesn’t exist, it will be created

```ts
export async function getMeals() {
```

- Declares an **async function** that can be used in **server components** or **API routes** in Next.js

```ts
await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay for demonstration
```

- Adds an **artificial delay of 1 second** to simulate a loading effect (e.g. for testing loading states in the UI)

```ts
return db.prepare("SELECT * FROM meals").all();
```

- Prepares a SQL query to select **all rows from the `meals` table**
- `.all()` is used to fetch **multiple rows**
- The result is returned as a JavaScript array of meal objects

#### Notes

- `better-sqlite3` is synchronous, so you **don’t need `await`** for the DB call itself.
- But since Next.js supports `async` server functions (e.g. in Server Components or `getServerSideProps`), wrapping this in an `async` function is still good practice.
- `.run()` → for insert/update/delete
- `.get()` → for fetching a **single** row
- `.all()` → for fetching **multiple** rows

### async in a server component

```js
import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "../../components/meals/meals-grid";
import { getMeals } from "@/lib/meals";

// we can use async keyword with server components
export default async function MealsPage() {
  // In next.js, we already have access to the database in the server components
  // so we don't need to fetch data in the client side and use useEffect

  // if the code return a promise, next.js will wait for the promise to resolve
  const meals = await getMeals();

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
        <MealsGrid meals={meals} />
      </main>
    </>
  );
}
```

### Add a loading page

- Next.js caches any page visited, so it can show it quickly as the user revisits the page
- But it would be nice to show loading indicator

#### `loading.js`

- When naming a file `loading`, that file will automatically be shown while the page or part of the page is loading

```js
import classes from "./loading.module.css";

export default function MealsLodingPage() {
  return <p className={classes.loading}>Fetching meals</p>;
}
```

#### Using `<Suspense>`

- While fetching data, it's good to show header for a better UX
- In this case, we can use `<Suspense>`
- `Suspense` is a React feature used to show a fallback UI (like a loading spinner or message) while a child component is “suspending”

```js
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
```

- While `Meals` is still loading, the fallback UI (`<p>Fetching meals...</p>`) will be shown
- Once data is fetched, the real `MealsGrid` is rendered

### `error.js`

- a custom error component
- It should be a **client component** to run on the client side to handle client-side rendering errors

```js
"use client";

export default function Error({ error }) {
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>Failed to fetch meal data. Please try again later.</p>
    </main>
  );
}
```

- Next.js automatically passes the `error` object, which has additional information on error

### `not-found.js`

- a file that will be shown when a page or resource is not found
- In a Next.js application using the App Router, this file is used whenever the `notFound()` function is explicitly called in your code, or when a route is requested that does not exist

```js
export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Meal Not Found</h1>
      <p>Unfortunately, we could not find the requested page or meal data.</p>
    </main>
  );
}
```

### Dynamic Route and Data Handling

```js
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
```

- This file handles the dynamic routing for individual meals based on a slug in the URL
- The page receives a `params` object that includes the URL segment corresponding to the dynamic route

### Image Picker Input Component

```js
"use client";
import { useRef } from "react";
import classes from "./image-picker.module.css";

export default function ImagePicker({ label, name }) {
  const imageInput = useRef();

  function handlePickClick() {
    // imageInput.current returns the actual DOM element
    imageInput.current.click(); // trigger the file input click event
    // This will open the file picker dialog when the button is clicked
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
        />
        {/* by default, button has type='submit' */}
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
```

### Show Image Preview

```js
"use client";
import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState();
  const imageInput = useRef();

  function handlePickClick() {
    // imageInput.current returns the actual DOM element
    imageInput.current.click(); // trigger the file input click event
    // This will open the file picker dialog when the button is clicked
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        {/* by default, button has type='submit' */}
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
```

```js
function handleImageChange(event) {
```

`handleImageChange` will be called when the user selects a file (from an `<input type="file" />`).

```js
const file = event.target.files[0]; // files is a FileList (not an array)
```

This gets the first file that the user selected from the file input element.

```js
if (!file) {
  setPickedImage(null);
  return;
}
```

If no file was selected, this clears the previously picked image by setting it to `null` and then exits the function early.

```js
const fileReader = new FileReader();
```

This creates a new `FileReader` object. It is used to read the contents of the file in a way that JavaScript can use.

```js
fileReader.onload = () => {
  setPickedImage(fileReader.result);
};
```

This sets a function to run when the file has been successfully read.
Once reading is complete, the result (a base64-encoded string) is stored using `setPickedImage`.

```js
fileReader.readAsDataURL(file);
```

This starts reading the file as a **Data URL** (a base64 string).
When it's done, the `onload` function defined above will be called.
Since `readAsDataURL` is asynchronous, the `fileReader.onload` handler must be set before calling it, so the browser knows what to do once the file has finished loading

### Server Actions

- Server Actions are a feature in Next.js to define functions that run directly on the server
- They are mainly used by assigning them to the `action` prop of a `<form>` element
- Normally, the `action` prop is used to specify a URL, but with Server Actions, we can directly assign a function
- Behind the scenes, Next.js sends a request to the server when the form is submitted
- The Server Action function is then executed **on the server**, not on the client
- As a best practice, it's recommended to keep Server Action functions in a separate file from JSX components

```js
"use server";
import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

// This defines a Server Action

export async function shareMeal(formData) {
  // Automatically receives formData from the form submission
  // Components are server components by default,
  // and to define a Server Action, you must add 'use server' at the top of the file or function.

  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  console.log(meal);

  // Store the meal in the database
  await saveMeal(meal);

  // Redirect the user to the meals page after submission
  redirect("/meals");
}
```

```js
import classes from "./page.module.css";
import ImagePicker from "@/components/meals/image-picker";
import { shareMeal } from "@/lib/actions";
import MealsFormSubmit from "@/components/meals/meals-form-submit";

export default function ShareMealPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={shareMeal}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              required
            ></textarea>
          </p>
          <ImagePicker label="Your image" name="image" />
          <p className={classes.actions}>
            <MealsFormSubmit />
          </p>
        </form>
      </main>
    </>
  );
}
```

### Save Image

- Images should be stored in file system, not database
  - Storing images directly in a database can lead to **large database sizes and performance issues**
  - Databases are optimized for structured data, not binary files like images
  - It's more efficient to save images in the file system and store **only the file path** in the database
- Use the `public` folder for user-uploaded image storage
  - In many web frameworks, the `public` folder is used to serve static files
  - Any files stored here can be accessed by clients through URLs
  - This makes it easy to display uploaded images without needing extra server-side logic to serve them.
- But it also has disadvantages
  - Everything in the public folder is accessible to anyone via a direct link
  - Sensitive or private images should not be stored here

#### Example

```js
export async function saveMeal(meal) {
```

- Exports an asynchronous function `saveMeal`, which takes a `meal` object as input

```js
meal.slug = slugify(meal.title, { lower: true });
```

- Creates a slug from the meal title (e.g., `"Chicken Curry"` → `"chicken-curry"`) and stores it in the `meal.slug` field

```js
meal.instructions = xss(meal.instructions);
```

- Sanitizes the `instructions` field to remove potentially malicious HTML or scripts

```js
const extenstion = meal.image.name.split(".").pop();
```

- Extracts the file extension from the uploaded image’s filename

```js
const fileName = `${meal.slug}.${extenstion}`;
```

- Combines the slug and file extension to create a new image filename (e.g., `chicken-curry.jpg`)

```js
const stream = fs.createWriteStream(`public/images/${fileName}`);
```

- `fs` is Node.js's built-in `fs` module, which allows reading from and writing to the file system
- Creates a write stream to save the image to the `public/images/` directory

```js
const bufferedImage = await meal.image.arrayBuffer();
```

- Reads the uploaded image as an `ArrayBuffer`. This is how browser-uploaded files are handled in memory.

```js
stream.write(
  Buffer.from(bufferedImage, (error) => {
    if (error) {
      throw new Error("Saving image failed");
    }
  })
);
```

- Converts the `ArrayBuffer` into a Node.js `Buffer` and writes it to the file

```js
meal.image = `/images/${fileName}`; // the path shouldn't include public/
```

- Updates the `meal.image` field with the public-facing image path (excluding the `public/` folder, which is automatically served as root in many frameworks)

```js
db.prepare(
  `
    INSERT INTO meals 
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)  
    `
).run(meal);
```

- Executes a parameterized SQL query to insert the meal into the database
- Using `.prepare(...).run(meal)` protects against SQL injection by binding the object values safely

### Managing Form Submission Status with `useFormStatus`

When using Server Actions, we may want to give users feedback while the form is being submitted (e.g., disabling the submit button or showing a loading state). Next.js provides a hook called `useFormStatus` for this purpose.

- `useFormStatus` **must be used inside a Client Component**
- It provides a `pending` boolean that indicates whether the form submission is in progress
- To avoid making the entire form a Client Component, it's best to isolate the submit button in its own file

```js
"use client";
import { useFormStatus } from "react-dom";

// Client component for the submit button
export default function MealsFormSubmit() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? "Submitting..." : "Share Meal"}
    </button>
  );
}
```

#### Notes:

- This allows the rest of the form to remain a Server Component
- Only the button component needs to be client-side, improving performance and maintaining server-rendering benefits elsewhere

## Form validatation

- We should validate form data on the backend
- Throwing an error would be one way to handle invalid input

```js
"use server";
import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

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
    throw new Error("Invalid input - all fields are required!");
  }

  // store database
  await saveMeal(meal);
  redirect("/meals");
}
```

- It would not be user-friendly, it can't hold the form data

#### `React.useActionState`

`useActionState` is a **React 19** hook that helps manage the **state of form submissions**, especially when using **Server Actions**

It allows server functions (e.g., validation logic or database operation) to return a result which is then **stored in React state** — no need to manually manage it.

#### Basic Usage

```js
const [state, formAction] = React.useActionState(actionFn, initialState);
```

- `state`: Holds the result returned by the action function (e.g., error messages, success text).
- `formAction`: This function is passed to `<form action={formAction}>` to handle submissions.
- There's also a third `isPending` value (currently experimental) that tracks submission status.

#### Parameters

```tsx
React.useActionState(
  actionFn: (prevState: State, formData: FormData) => Promise<State>,
  initialState: State
)
```

| Parameter      | Description                            |
| -------------- | -------------------------------------- |
| `actionFn`     | Async function (often a server action) |
| `initialState` | The initial state for the form         |

> The `actionFn` will receive:
>
> 1. the previous state
> 2. the `FormData` object from the form submission

#### 1. Server Action

```ts
// app/actions.ts
"use server";

export async function submitForm(prevState: any, formData: FormData) {
  const name = formData.get("name")?.toString();

  if (!name) {
    return { message: "Name is required." };
  }

  return { message: `Hello, ${name}!` };
}
```

#### 2. Client Component

```tsx
"use client";
import React from "react";
import { submitForm } from "./actions";

export default function Page() {
  const [state, formAction] = React.useActionState(submitForm, { message: "" });

  return (
    <form action={formAction}>
      <input name="name" placeholder="Enter your name" />
      <button type="submit">Submit</button>
      <p>{state.message}</p>
    </form>
  );
}
```

#### Notes

- Requires **React 19 or later**
- `useActionState` must be used **inside a client component** (`'use client'`)
- Works best with the **App Router and Server Actions** in Next.js

#### When Use It?

- want to handle **form submissions without manually managing state**
- need **server-side validation or processing**, and want to return results (e.g., error messages)
- want to keep a **declarative and progressive** form structure, but still get the full power of server interactions

## Caching System in Next.js

- Next.js has an **aggressive caching system** to improve performance
- It **pre-generates pages during the build process** (SSG - Static Site Generation)
- This allows users to see the page **instantly**, without having to wait for server-side processing
- However, **cached pages are not re-fetched automatically**, which can cause problems when the underlying data changes

To solve that, we can use `revalidatePath()` to **manually trigger cache revalidation**

### Example

```ts
"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text: FormDataEntryValue | null): boolean {
  return !text || text.toString().trim() === "";
}

export async function shareMeal(prevState: any, formData: FormData) {
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
    !meal.creator_email.toString().includes("@") ||
    !meal.image ||
    (meal.image as File).size === 0
  ) {
    return {
      message: "Invalid input",
    };
  }

  // 1. Save the meal to the database
  await saveMeal(meal);

  // 2. Revalidate the `/meals` path so that the new data shows up immediately
  revalidatePath("/meals"); // Revalidates cache for this path

  // 3. Redirect the user to the updated page
  redirect("/meals");
}
```

### `revalidatePath(path, type?)`

- `path`: The URL path to revalidate (e.g., `/meals`)
- `type` (optional): Can be `"page"` (default) or `"layout"` if the route uses a layout and we want to revalidate shared data

---

## Do NOT Store Uploaded Files Locally

- Storing uploaded files **on the local filesystem is not recommended** in Next.js apps
- This is because Next.js app might run on **serverless environments** (like Vercel or AWS Lambda) where filesystems are **temporary or read-only**
- Instead, use **cloud storage solutions** (like AWS S3, Cloudinary, Firebase Storage, etc.) to persist and serve uploaded files reliably

## Adding Metadata in Next.js

Next.js supports a powerful **metadata API** to help improve SEO and accessibility by setting the `<title>`, `<meta>`, and other head tags for each page.

It automatically looks for metadata definitions in your page files and uses them during rendering.

### Static Metadata

We can define static metadata by exporting a `metadata` object directly in a page file.

```tsx
// app/meals/page.tsx

export const metadata = {
  title: "All Meals",
  description: "Browse the delicious meals shared by our vibrant community",
};
```

#### How it works:

- Next.js will insert this metadata into the `<head>` of the rendered HTML
- This works well for pages where metadata doesn’t depend on dynamic data

### Dynamic Metadata

If we need metadata that depends on dynamic content (like page params or database content), use the `generateMetadata` function

```tsx
// app/meals/[mealSlug]/page.tsx
import { getMeal } from "@/lib/meals"; // hypothetical function
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const meal = await getMeal(params.mealSlug);

  if (!meal) {
    notFound(); // Triggers 404 page
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}
```

#### How it works:

- `generateMetadata()` is a **server-side async function**
- It receives `params`, `searchParams`, and more if needed
- Ideal for **dynamic routes**, such as `/meals/:slug`
- Because `generateMetadata()` runs before the page is rendered, we need to check if the data exists. Otherwise, it may lead to an error or generate incorrect metadata

### Notes

- We can also customize other metadata fields like `keywords`, `robots`, `themeColor`, and Open Graph / Twitter tags
- Metadata is composable across layouts and nested routes
- Use it to build dynamic titles, summaries, and shareable previews
