import { CORE_CONCEPTS } from "./data.js";
import Header from "./components/Header/Header.jsx";
import CoreConcept from "./components/CoreConcept.jsx";
import TabButton from "./components/TabButton.jsx";
import { EXAMPLES } from "./data.js";

// react code : the react code you write & test
// build process : changes & optimizes code
// transforms it such that it runs in the browser
// also (potentially) optimizes other assets like CSS & image files
// deployable files : a collection of generated files that include optimized code and any other extra assets (CSS code files, optimized images etc)

// static content
// content that's hardcoded into the jsx code
// can't change at runtime

// dynmaic content
// logic that produces the actual value is added to JSX
// content / value is derived at runtime

import { useState } from "react";
// react hook - all functions starting with use
// regular functions but they must be called inside of React component functions or inside of React Hooks

function App() {
  // props : concept of configuring components
  // props accept all value type (not limited to text values)
  // number value : curly braces are required to pass the value as a number. If quotes were used, it would be considered a string
  // object value : this is no special "double curly braces" syntax!
  // it's simply a JS object passed as a value
  // when the object in CORE_CONCEPTS has the same key name to the props's attribute, it can be shortened
  // let tabContent = "Please click a button";

  const [selectedTopic, setSelectedTopic] = useState(); // call it on the top level of the component function
  // param : the initial value

  function handleSelect(selectedButton) {
    // selectedButton => 'components', 'jsx', 'props', 'state'
    setSelectedTopic(selectedButton);
    console.log(selectedTopic);

    //
    // console.log(selectedButton); // clearly functing is updating....
    // tabContent = selectedButton; // but the UI is not updating bc App Component function is not executed again
    // by default, react components execute only once (important to keep in mind)
    // we have to tell react if a component should be executed again
    // how react checks if UI updates are needed
    // react compares the old output of component function to the new output
    // and applies any differences to the actual website UI
  }
  console.log("APP COMPONENT EXECUTING");

  let tabContent = <p>Please select a topic.</p>;

  // output conditionally
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
    <div>
      <Header></Header>
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            {/* outputting list data dynamically */}
            {/* transform arrays to an array of JSX elements */}
            {CORE_CONCEPTS.map((conceptItem) => (
              <CoreConcept key={conceptItem.title} {...conceptItem} />
            ))}
            {/* <CoreConcept
              title={CORE_CONCEPTS[0].title}
              description={CORE_CONCEPTS[0].description}
              image={CORE_CONCEPTS[0].image}
            />
            <CoreConcept {...CORE_CONCEPTS[1]} />
            <CoreConcept {...CORE_CONCEPTS[2]} />
            <CoreConcept {...CORE_CONCEPTS[3]} /> */}
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            {/* depending on which tab button was pressed... */}
            {/* custom parameter in event handling function*/}
            {/* arrow function can be passed as a value */}
            {/* now the code in arrow function won't run immediately when this line gets parsed, but after the button is clicked */}
            {/* if you want to define a function that should be executed upon an event, but also control how it's going to be called and which arguments are going to be passed to it */}
            <TabButton
              isSelected={selectedTopic === "components"}
              onSelect={() => handleSelect("components")}
            >
              Components
            </TabButton>
            <TabButton
              isSelected={selectedTopic === "jsx"}
              onSelect={() => handleSelect("jsx")}
            >
              JSX
            </TabButton>
            <TabButton
              isSelected={selectedTopic === "props"}
              onSelect={() => handleSelect("props")}
            >
              Props
            </TabButton>
            <TabButton
              isSelected={selectedTopic === "state"}
              onSelect={() => handleSelect("state")}
            >
              States
            </TabButton>
          </menu>
          {tabContent}
        </section>
      </main>
    </div>
  );
}

export default App;
// jsx : a javascript file that uses non-standard js syntax
// javascript syntax extension. used to describe & create HTML elements in js in a declarative way
// but broswer doesn't support jsx file
// react projects come with "a build process" that transform jsx code (behind the scene) to code that does work in browser
// component functions must follow two rules
// 1. name starts with uppercase character
// multi-word should be written in PascalCase (e.g. MyHeader)
// it's recommended to pick a name that describes the UI building block (e.g. Header or MyHeader)
// 2. Returns "Renderable" Content
// the function must return a value that can be rendered by React
// In most cases: Return jsx also allowed : string, number, boolean, null, array of allowed values

// configuring components with props
// react allows you to pass data to components via a concept called "Props"
// jsx code that uses a component set component input data via "custom HTML attributes" (props)
// component : defines internal logic + jsx code that should be rendered
// component function receives props parameter with configuration data
