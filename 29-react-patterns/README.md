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
