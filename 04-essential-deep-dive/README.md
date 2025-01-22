## React Essentials Deep Dive

### JSX code
##### JSX code
- not supported by browser
- requires build process & code transformation
- easy to read & understand
```jsx
<div id="content">
	<p>Hello World!</p>
</div>
```
##### JavaScript code
- works without build process & transformation
- pretty verbose & not necessarily intuitive
```javascript
React.createElement(
    "div", 
    { id: "content" }, 
    React.createElement("p", null, "Hello World!")
);
```
- createElement takes component type as the first argument
	- component type identifies the to-be-rendered component
- second arg : props object 
- third arg : the content passed between the component tags
### Fragments
- JSX code should return only one value
- So we should wrap code using div - but we end up with extra div in DOM 
- Instead we can also use fragment component (`<></>`)

---

### Additional Key Components & Props Concepts
- forwarded props
- multiple component slots
- element identifiers as props
- default prop values

---

### Forwarded Props
```jsx
import React, { useState } from "react";
import TapButton from "./TapButton";
import { EXAMPLES } from "../data";

export default function Examples() {
  const [selectedTopic, setSelectedTopic] = useState();

  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
    console.log(selectedTopic); // current state, not updated state value
  }

  let tabContent = <p>Please select a topic.</p>;

  if (selectedTopic) {
    tabContent = (
      <div id="tab-content">
        <h3>{EXAMPLES[selectedTopic].title}</h3>
        <p>{EXAMPLES[selectedTopic].description}</p>
        <pre>
          <code>{EXAMPLES[selectedTopic].code}</code>
        </pre>
      </div>
    );
  }

  return (
    <section id="examples">
      <h2>Example</h2>
      <menu>
        <TapButton
          isSelected={selectedTopic === "components"}
          onSelect={() => handleSelect("components")}
        >
          Components
        </TapButton>
        <TapButton
          isSelected={selectedTopic === "jsx"}
          onSelect={() => handleSelect("jsx")}
        >
          JSX
        </TapButton>
        <TapButton
          isSelected={selectedTopic === "props"}
          onSelect={() => handleSelect("props")}
        >
          Props
        </TapButton>
        <TapButton
          isSelected={selectedTopic === "state"}
          onSelect={() => handleSelect("state")}
        >
          State
        </TapButton>
      </menu>
      {tabContent}
    </section>
  );
}
```

- We can build a reusable component to wrap overall content - in this case the returned code
`Section.jsx`
```jsx
import React from "react";

export default function Section({ title, children, ...props }) {
  return (
    <section {...props}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

---

- After applying custom component :
```jsx
return (
  <Section title="Example" id="examples">
    <menu>
      <TapButton
        isSelected={selectedTopic === "components"}
        onSelect={() => handleSelect("components")}
      >
        Components
      </TapButton>
      <TapButton
        isSelected={selectedTopic === "jsx"}
        onSelect={() => handleSelect("jsx")}
      >
        JSX
      </TapButton>
      <TapButton
        isSelected={selectedTopic === "props"}
        onSelect={() => handleSelect("props")}
      >
        Props
      </TapButton>
      <TapButton
        isSelected={selectedTopic === "state"}
        onSelect={() => handleSelect("state")}
      >
        State
      </TapButton>
    </menu>
    {tabContent}
  </Section>
);
```

- IMPORTANT to note : props set on components are not automatically forwarded to JSX code (in this case, the `id` prop on `Section` component)
- Props must be used & set explicitly
---

#### `Tabs.jsx`
```jsx
import React from "react";

export default function Tabs({ buttons, children }) {
  return (
    <>
      <menu>{buttons}</menu>
      {children}
    </>
  );
}
```

#### `Examples.jsx` with `Tabs.jsx`
```jsx
import React, { useState } from "react";
import TapButton from "./TapButton";
import { EXAMPLES } from "../data";
import Section from "./Section";
import Tabs from "./Tabs";

export default function Examples() {
  const [selectedTopic, setSelectedTopic] = useState();

  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
    console.log(selectedTopic); // current state, not updated state value
  }

  let tabContent = <p>Please select a topic.</p>;

  if (selectedTopic) {
    tabContent = (
      <div id="tab-content">
        <h3>{EXAMPLES[selectedTopic].title}</h3>
        <p>{EXAMPLES[selectedTopic].description}</p>
        <pre>
          <code>{EXAMPLES[selectedTopic].code}</code>
        </pre>
      </div>
    );
  }

  return (
    <Section title="Example" id="examples">
      <Tabs
        buttons={
          <>
            <TapButton
              isSelected={selectedTopic === "components"}
              onClick={() => handleSelect("components")}
            >
              Components
            </TapButton>
            <TapButton
              isSelected={selectedTopic === "jsx"}
              onClick={() => handleSelect("jsx")}
            >
              JSX
            </TapButton>
            <TapButton
              isSelected={selectedTopic === "props"}
              onClick={() => handleSelect("props")}
            >
              Props
            </TapButton>
            <TapButton
              isSelected={selectedTopic === "state"}
              onClick={() => handleSelect("state")}
            >
              State
            </TapButton>
          </>
        }
      >
        {tabContent}
      </Tabs>
    </Section>
  );
}
```

---

### Setting component types dynamically

- We can pass a component identifier as a value for a prop.  
- Props must be usable as a custom component in the receiving component:  
  - The name of the prop must start with an uppercase letter or  
  - They must be remapped to a constant.  
- For identifiers:  
  - Use string names for built-in components like `<menu>`, `<li>`.  
  - Pass the component function name for a custom component as a prop value.  

#### `Tabs.jsx`
```jsx
import React from "react";

export default function Tabs({ buttons, ButtonsContainer = "menu", children }) {
  return (
    <>
      <ButtonsContainer>{buttons}</ButtonsContainer>
      {children}
    </>
  );
}
```

---

#### `Examples.jsx`
```jsx
return (
  <Section title="Example" id="examples">
    <Tabs
      ButtonsContainer="menu"
      buttons={
        <>
          <menu>
            {/* arrow function is the value passed as a value to onSelect, also to onClick in TapButton.jsx */}
            {/* this function will be executed when the button is clicked */}
            {/* now we can control how it will be executed */}
            <TapButton
              isSelected={selectedTopic === "components"}
              onClick={() => handleSelect("components")}
            >
              Components
            </TapButton>
            <TapButton
              isSelected={selectedTopic === "jsx"}
              onClick={() => handleSelect("jsx")}
            >
              JSX
            </TapButton>
            <TapButton
              isSelected={selectedTopic === "props"}
              onClick={() => handleSelect("props")}
            >
              Props
            </TapButton>
            <TapButton
              isSelected={selectedTopic === "state"}
              onClick={() => handleSelect("state")}
            >
              State
            </TapButton>
          </menu>
        </>
      }
    >
      {tabContent}
    </Tabs>
  </Section>
);
```

---

- `ButtonsContainer="menu"` works as an identifier for the wrapped elements in the inner element.  
- This approach dynamically determines the container type for buttons in the `Tabs` component.