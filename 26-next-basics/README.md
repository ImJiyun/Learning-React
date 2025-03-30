## Next.js

### File system-based routing

- Next.js uses files & folders to define routes
- Only files & folders inside the "app" folder are considered

### NextJS works with React Server Components

- Components which require a special "environment"
- By default, components are "server components"
- NextJS provides such an environment where React server compoents rendered only on the server NEVER on the client
- Page / HTML content is rendered on the server & sent to the client

### Server & client-side working together

- The backend executes the server component functions & hence derives the to-be-rendered HTML code
- The client-side receives & renders the to-be-rendered HTML code

### Filenames Matter!

- NextJS relies on reserved, special filenames
- But the filenames only matter inside the "app" folder
- `page.js` : define page content
- `layout.js` : define wrappaer around pages
- `not-found.js` : define "Not Found" fallback page
- `error.js` : define "Error" fallback page
- `loading.js` : fallback page which is shown whilst sibling or nested page (or layouts) are fetching data
- `route.js` : allows us to create an API route (i.g., a page which does NOT return JSX code but instead data, e.g., in the JSON format)
- `icon` : a favicon

### Naviage between pages

```js
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <img src="/logo.png" alt="A server surrounded by magic sparkles." />
      <h1>Welcome to this NextJS Course!</h1>
      <p>🔥 Let&apos;s get started! 🔥</p>
      <p>
        <Link href="/about">About Us</Link>
      </p>
    </main>
  );
}
```

- `<Link>` enables fast client-side navigation without a full page reload, improving the user experience
- `<a>` triggers a full request to the server every time

### Working with pages & layouts

- page.js defines the content of a page, layout.js defines the shell around the page
- Every NextJS project needs at least one root layout.js file

```js
import "./globals.css";

export const metadata = {
  title: "NextJS Course App",
  description: "Your first NextJS app!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- `children` is the content of the page currently active

### How to organize a NextJS project

- `app` folder should remain purpose of routing
- put `components` folder outside of `app` folder

### Dynamic routes

- Dynamic route should be capable of rendering different pages, while we define only once
- Folder named with square brackets (e.g., [slug]/page.js) indicates a dynamic route. The value inside the brackets (in this case, `slug`) will be treated as a dynamic parameter, meaning it can represent any value passed in the URL.
- Next.js automatically passes a `params` object to dynamic page components. This object contains the dynamic route parameters.

```js
export default function BlogPostPage({ params }) {
  return (
    <main>
      <h1>Blog Post</h1>
      <p>{params.slug}</p>
    </main>
  );
}
```
