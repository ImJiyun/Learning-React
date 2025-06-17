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
