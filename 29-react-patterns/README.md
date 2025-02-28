## Compound Components

### Definition

Mutiple components that don't work standalone but instead together
one of examples is accordion, if one of elements is open, any other open elements should close

### Managing mutli-component state with Context API

#### `Accordion.jsx`

- It is a component, a shell for other `AccordionItem` components
- Since the logic inside the component is forwarding the `children`, not rendering it, we need to use context API.

```jsx
import { createContext, useContext, useState } from "react";

// AccorionContext is tied to the Accordion components
const AccordionContext = createContext();

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);

  // if the component is not wrapped by the Accordion component
  if (!ctx) {
    throw new Error(
      "Accordion-related components must be wrapped by <Accordion>"
    );
  }
  return ctx;
}

export default function Accordion({ children, className }) {
  const [openItemId, setOpenItemId] = useState();
  // It should be only one item that's open at the same time
  //  so we need to keep track of the open item

  function openItem(id) {
    setOpenItemId(id);
  }

  function closeItem() {
    setOpenItemId(null);
  }
  const contextValue = {
    openItemId: openItemId,
    openItem,
    closeItem,
  };

  //  a shell for the Accordion component
  return (
    <AccordionContext.Provider value={contextValue}>
      <ul className={className}>{children}</ul>
    </AccordionContext.Provider>
  );
}
```

- By defining custom hook, we can simply the process for `AccordionItem` to use the `AccordionContext`

#### `AccordionItem.jsx`

```jsx
import { useAccordionContext } from "./Accordion";

export default function AccordionItem({ id, className, title, children }) {
  const { openItemId, openItem, closeItem } = useAccordionContext();

  const isOpen = openItemId === id;

  function handleClick() {
    if (isOpen) {
      closeItem();
    } else {
      openItem(id);
    }
  }

  return (
    <li className={className}>
      <h3 onClick={handleClick}>{title}</h3>
      <div
        className={
          isOpen ? "accordion-item-content open" : "accordion-item-content"
        }
      >
        {children}
      </div>
    </li>
  );
}
```

#### `App.jsx`

```jsx
import Accordion from "./components/Accordion/Accordion";
import AccordionItem from "./components/Accordion/AccordionItem";

function App() {
  return (
    <main>
      <section>
        <h2>Why work with us?</h2>
        <Accordion className="accordion">
          <AccordionItem
            id="experience"
            className="accordion-item"
            title="We got 20 years of experience"
          >
            <article>
              <p>You can&apos;t go wrong with us.</p>
              <p>
                We are in the businness of planning highly individualized
                vacation trips for more than 20 years.
              </p>
            </article>
          </AccordionItem>
          <AccordionItem
            id="local-guides"
            className="accordion-item"
            title="We're working with local guides"
          >
            <article>
              <p>We are not doing this along from our office.</p>
              <p>
                Instead, we are working with local guides who have a passion for
              </p>
            </article>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}

export default App;
```

### Grouping Compound Components

- It's common pattern to merge all identifier into one object
- Use the main wrapping function object as an object to which all the other identifiers should be merged, as JavaScript functions are just object values

```jsx
import { createContext, useContext, useState } from "react";
import AccordionItem from "./AccordionItem";

// AccorionContext is tied to the Accordion components
const AccordionContext = createContext();

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);

  // if the component is not wrapped by the Accordion component
  if (!ctx) {
    throw new Error(
      "Accordion-related components must be wrapped by <Accordion>"
    );
  }
  return ctx;
}

export default function Accordion({ children, className }) {
  const [openItemId, setOpenItemId] = useState();
  // It should be only one item that's open at the same time
  //  so we need to keep track of the open item

  function toggleItem(id) {
    // if the id is the same as the openItemId, set it to null (it means we clicked on the same item)
    //  otherwise, set it to the id
    setOpenItemId((prevId) => (prevId === id ? null : id));
  }

  const contextValue = {
    openItemId: openItemId,
    toggleItem,
  };

  //  a shell for the Accordion component
  return (
    <AccordionContext.Provider value={contextValue}>
      <ul className={className}>{children}</ul>
    </AccordionContext.Provider>
  );
}

// add the AccordionItem to the Accordion component
// functions are just values
Accordion.Item = AccordionItem; // items now belongs to the Accordion component
// so now if we use AccordionItem outside of the Accordion component, it will throw an error
//  because it's not wrapped by the Accordion component
```

- `Accordion.Item = AccordionItem;` now makes `AccordionItem` belongs to the `Accordion` component
- So if the `AccordionItem` component is used outside of `Accordion`, React will throw an error.

```jsx
import Accordion from "./components/Accordion/Accordion";

function App() {
  return (
    <main>
      <section>
        <h2>Why work with us?</h2>
        <Accordion className="accordion">
          <Accordion.Item
            id="experience"
            className="accordion-item"
            title="We got 20 years of experience"
          >
            <article>
              <p>You can&apos;t go wrong with us.</p>
              <p>
                We are in the businness of planning highly individualized
                vacation trips for more than 20 years.
              </p>
            </article>
          </Accordion.Item>
          <Accordion.Item
            id="local-guides"
            className="accordion-item"
            title="We're working with local guides"
          >
            <article>
              <p>We are not doing this along from our office.</p>
              <p>
                Instead, we are working with local guides who have a passion for
              </p>
            </article>
          </Accordion.Item>
        </Accordion>
      </section>
    </main>
  );
}

export default App;
```

- Now, we don't have to import `AccordionItem` in `App.jsx`

### Adding extra components for resuability & configurability

- We can use extra components (`AccordionTitle`, `AccordionContent`) for greater reusability and configurability

#### `AccordionTitle.jsx`

```jsx
import { useAccordionContext } from "./Accordion";

export default function AccordionTitle({ id, className, children }) {
  const { toggleItem } = useAccordionContext();

  return (
    <h3 className={className} onClick={() => toggleItem(id)}>
      {children}
    </h3>
  );
}
```

#### `AccordionContent.jsx`

```jsx
import { useAccordionContext } from "./Accordion";

export default function AccordionContent({ id, className, children }) {
  const { openItemId } = useAccordionContext();

  const isOpen = openItemId === id;

  return (
    <div
      className={
        isOpen ? `${className ?? ""} open` : `${className ?? ""} close`
      }
    >
      {children}
    </div>
  );
}
```

#### `Accordion.jsx`

- Add `AccordionTitle`, `AccordionContent` to `Accordion` as properties of an object (functions are just values)

```jsx
import { createContext, useContext, useState } from "react";
import AccordionItem from "./AccordionItem";
import AccordionTitle from "./AccordionTitle";
import AccordionContent from "./AccordionContent";

// AccorionContext is tied to the Accordion components
const AccordionContext = createContext();

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);

  // if the component is not wrapped by the Accordion component
  if (!ctx) {
    throw new Error(
      "Accordion-related components must be wrapped by <Accordion>"
    );
  }
  return ctx;
}

export default function Accordion({ children, className }) {
  const [openItemId, setOpenItemId] = useState();
  // It should be only one item that's open at the same time
  //  so we need to keep track of the open item

  function toggleItem(id) {
    // if the id is the same as the openItemId, set it to null (it means we clicked on the same item)
    //  otherwise, set it to the id
    setOpenItemId((prevId) => (prevId === id ? null : id));
  }

  const contextValue = {
    openItemId: openItemId,
    toggleItem,
  };

  //  a shell for the Accordion component
  return (
    <AccordionContext.Provider value={contextValue}>
      <ul className={className}>{children}</ul>
    </AccordionContext.Provider>
  );
}

// add the AccordionItem to the Accordion component
// functions are just values
Accordion.Item = AccordionItem; // items now belongs to the Accordion component
// so now if we use AccordionItem outside of the Accordion component, it will throw an error
//  because it's not wrapped by the Accordion component
Accordion.Title = AccordionTitle;
Accordion.Content = AccordionContent;
```

#### `App.jsx`

```jsx
import Accordion from "./components/Accordion/Accordion";

function App() {
  return (
    <main>
      <section>
        <h2>Why work with us?</h2>
        <Accordion className="accordion">
          <Accordion.Item className="accordion-item">
            <Accordion.Title className="accordion-item-title" id="experience">
              We got 20 years of experience
            </Accordion.Title>
            <Accordion.Content
              className="accordion-item-content"
              id="experience"
            >
              <article>
                <p>You can&apos;t go wrong with us.</p>
                <p>
                  We are in the businness of planning highly individualized
                  vacation trips for more than 20 years.
                </p>
              </article>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item className="accordion-item">
            <Accordion.Title className="accordion-item-title" id="local-guides">
              We're working with local guides
            </Accordion.Title>
            <Accordion.Content
              className="accordion-item-content"
              id="local-guides"
            >
              <article>
                <p>We are not doing this along from our office.</p>
                <p>
                  Instead, we are working with local guides who have a passion
                  for
                </p>
              </article>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </section>
    </main>
  );
}

export default App;
```

### Sharing cross-component state when working with compound components

- It could be much nicer if we pass the id props through `Acccordion.Item` to `Accordion.Title` & `Accordion`.Content
- For now, the `AccordionItem` component doesn't have access to children, so we can't do that with props
- The solution is to use context API

#### `AccordionItem`

```jsx
import { createContext, useContext } from "react";

const AccordionItemContext = createContext();

export function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);

  if (!ctx) {
    throw new Error(
      "AccordionItem-related components must be wrapped by <AccordionItem>"
    );
  }

  return ctx;
}

export default function AccordionItem({ id, className, children }) {
  return (
    <AccordionItemContext.Provider value={id}>
      <li className={className}>{children}</li>
    </AccordionItemContext.Provider>
  );
}
```

#### `AccordionTitle`

```jsx
import { useAccordionContext } from "./Accordion";
import { useAccordionItemContext } from "./AccordionItem";

export default function AccordionTitle({ className, children }) {
  const { toggleItem } = useAccordionContext();

  const id = useAccordionItemContext();

  return (
    <h3 className={className} onClick={() => toggleItem(id)}>
      {children}
    </h3>
  );
}
```

#### `AccordionContent`

```jsx
import { useAccordionContext } from "./Accordion";
import { useAccordionItemContext } from "./AccordionItem";

export default function AccordionContent({ className, children }) {
  const { openItemId } = useAccordionContext();
  const id = useAccordionItemContext();

  const isOpen = openItemId === id;

  return (
    <div
      className={
        isOpen ? `${className ?? ""} open` : `${className ?? ""} close`
      }
    >
      {children}
    </div>
  );
}
```

#### `App`

- Now we can only specify id props once

```jsx
import Accordion from "./components/Accordion/Accordion";

function App() {
  return (
    <main>
      <section>
        <h2>Why work with us?</h2>
        <Accordion className="accordion">
          <Accordion.Item className="accordion-item" id="experience">
            <Accordion.Title className="accordion-item-title">
              We got 20 years of experience
            </Accordion.Title>
            <Accordion.Content className="accordion-item-content">
              <article>
                <p>You can&apos;t go wrong with us.</p>
                <p>
                  We are in the businness of planning highly individualized
                  vacation trips for more than 20 years.
                </p>
              </article>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item className="accordion-item" id="local-guides">
            <Accordion.Title className="accordion-item-title">
              We're working with local guides
            </Accordion.Title>
            <Accordion.Content className="accordion-item-content">
              <article>
                <p>We are not doing this along from our office.</p>
                <p>
                  Instead, we are working with local guides who have a passion
                  for
                </p>
              </article>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </section>
    </main>
  );
}

export default App;
```

### Render props

- Passing a function a value for the children prop
- That function must return something renderable
- WHEN to use:

  - The component should handle logic, not rendering
  - Different data types need to be rendered in different ways
  - We want to make the component reusable and flexiable

- It can be used on different kinds of data
- It cares on containing search logic, not on controlling how the items should be rendered

#### The current problem with `SearchableList`

```jsx
import { useState } from "react";

function SearchableList({ items }) {
  const [searchTerm, setSearchTerm] = useState("");

  // convert all items to strings and filter them based on the search term
  const searchResults = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleChange(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="searchable-list">
      <input type="search" placeholder="Search" onChange={handleChange} />
      <ul>
        {searchResults.map((item, index) => (
          <li key={index}>{item.toString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableList;
```

- Not great at outputting the results and dealing with all kinds of data
- For string data, we want to output data using `toString()`
- For object, we want to output a more complex markup

- That's where `render` prop can help us
- It deals with the rendering logic

### Implementing a Search Functionality with render props

- The updated `SearchableList` component now accepts a children prop, which is a function that determines how each search result is rendered.

- The component is no longer responsible for rendering the items.
- Instead, the parent component decides how to display search results.
- The `children` prop is called with each item in the filtered search results, providing full control over rendering.

```jsx
import { useState } from "react";

function SearchableList({ items, children }) {
  const [searchTerm, setSearchTerm] = useState("");

  // convert all items to strings and filter them based on the search term
  const searchResults = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleChange(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="searchable-list">
      <input type="search" placeholder="Search" onChange={handleChange} />
      <ul>
        {searchResults.map((item, index) => (
          <li key={index}>{children(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableList;
```

```jsx
import Accordion from "./components/Accordion/Accordion";

import savannaImg from "./assets/african-savanna.jpg";
import amazonImg from "./assets/amazon-river.jpg";
import caribbeanImg from "./assets/caribbean-beach.jpg";
import desertImg from "./assets/desert-dunes.jpg";
import forestImg from "./assets/forest-waterfall.jpg";
import SearchableList from "./components/SearchableList/SearchableList";
import Place from "./Place";

const PLACES = [
  {
    id: "african-savanna",
    image: savannaImg,
    title: "African Savanna",
    description: "Experience the beauty of nature.",
  },
  {
    id: "amazon-river",
    image: amazonImg,
    title: "Amazon River",
    description: "Get to know the largest river in the world.",
  },
  {
    id: "caribbean-beach",
    image: caribbeanImg,
    title: "Caribbean Beach",
    description: "Enjoy the sun and the beach.",
  },
  {
    id: "desert-dunes",
    image: desertImg,
    title: "Desert Dunes",
    description: "Discover the desert life.",
  },
  {
    id: "forest-waterfall",
    image: forestImg,
    title: "Forest Waterfall",
    description: "Listen to the sound of the water.",
  },
];

function App() {
  return (
    <main>
      ...
      <section>
        <SearchableList items={PLACES}>
          {(item) => <Place item={item} />}
        </SearchableList>
        <SearchableList items={["item 1", "item 2"]}>
          {(item) => item}
        </SearchableList>
      </section>
    </main>
  );
}

export default App;
```

### Handling Keys Dynamically

- Using `index` as `key` is not a great way as it's not directly linked to the data
- `item.id` is also not a great `key` as not all item is object type
- We need to convert items based on the type of item data

#### `SearchableList.jsx`

```jsx
import { useState } from "react";

function SearchableList({ items, itemKeyFn, children }) {
  const [searchTerm, setSearchTerm] = useState("");

  // convert all items to strings and filter them based on the search term
  const searchResults = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleChange(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="searchable-list">
      <input type="search" placeholder="Search" onChange={handleChange} />
      <ul>
        {searchResults.map((item) => (
          <li key={itemKeyFn(item)}>{children(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableList;
```

- `itemKeyFn` : dynamically generate a key for a specific item

#### `App.jsx`

```jsx
import Accordion from "./components/Accordion/Accordion";

import savannaImg from "./assets/african-savanna.jpg";
import amazonImg from "./assets/amazon-river.jpg";
import caribbeanImg from "./assets/caribbean-beach.jpg";
import desertImg from "./assets/desert-dunes.jpg";
import forestImg from "./assets/forest-waterfall.jpg";
import SearchableList from "./components/SearchableList/SearchableList";
import Place from "./Place";

const PLACES = [
  {
    id: "african-savanna",
    image: savannaImg,
    title: "African Savanna",
    description: "Experience the beauty of nature.",
  },
  {
    id: "amazon-river",
    image: amazonImg,
    title: "Amazon River",
    description: "Get to know the largest river in the world.",
  },
  {
    id: "caribbean-beach",
    image: caribbeanImg,
    title: "Caribbean Beach",
    description: "Enjoy the sun and the beach.",
  },
  {
    id: "desert-dunes",
    image: desertImg,
    title: "Desert Dunes",
    description: "Discover the desert life.",
  },
  {
    id: "forest-waterfall",
    image: forestImg,
    title: "Forest Waterfall",
    description: "Listen to the sound of the water.",
  },
];

function App() {
  return (
    <main>
      ...
      <section>
        <SearchableList items={PLACES} itemKeyFn={(item) => item.id}>
          {(item) => <Place item={item} />}
        </SearchableList>
        <SearchableList items={["item 1", "item 2"]} itemKeyFn={(item) => item}>
          {(item) => item}
        </SearchableList>
      </section>
    </main>
  );
}

export default App;
```

- For object type, the component passes a function that returns `item.id`
- For string type, it passes a function that returns `item`

### Working with Debouncing

- a programming technique used to limit the rate at which a function is executed
- It prevents a function being rendered too frequently, which can lead to performance issues

#### Example

```jsx
import { useState } from "react";

function SearchableList({ items, itemKeyFn, children }) {
  const [searchTerm, setSearchTerm] = useState("");

  // convert all items to strings and filter them based on the search term
  const searchResults = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleChange(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="searchable-list">
      <input type="search" placeholder="Search" onChange={handleChange} />
      <ul>
        {searchResults.map((item) => (
          <li key={itemKeyFn(item)}>{children(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableList;
```

- On every keystroke, handleChange function gets triggered, leading to the component being rendered again
- We want to update the state if the user stopped typing for a couple of milliseconds

```jsx
import { useRef, useState } from "react";

function SearchableList({ items, itemKeyFn, children }) {
  const lastChange = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  // convert all items to strings and filter them based on the search term
  const searchResults = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleChange(event) {
    // if there is an onging timer, clear it, and start a new one
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }
    // debounce the search term to avoid searching on every key press
    // delay the search term update by 500ms

    // store tiemer id in ref to clear it on every key press
    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      setSearchTerm(event.target.value);
    }, 500);
  }

  return (
    <div className="searchable-list">
      <input type="search" placeholder="Search" onChange={handleChange} />
      <ul>
        {searchResults.map((item) => (
          <li key={itemKeyFn(item)}>{children(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableList;
```

- In `handleChange`,
  - Clears any existing timeout (prevents executing multiple delayed updates)
  - Starts a new timer (setTimeout) to delay updating searchTerm by 500ms
  - After 500ms of no typing, the search term is updated, triggering a re-render
