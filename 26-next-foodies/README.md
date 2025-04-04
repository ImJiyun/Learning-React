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
