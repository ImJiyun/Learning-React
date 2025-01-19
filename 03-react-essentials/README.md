## React Essentials
### Component
- React apps are about combining components
- Any website or app can be broken down into smaller building blocks : components
- Components can potentially be reused.
#### Why components?
1. Reusable building blocks
	- Create small building blocks & compose the UI from them
	- If needed : Reuse a building block in different parts of the UI 
2.  Related code lives together
	- Related HTML & JS (and possibly CSS) code is stored together
	- Since JS influences the output, storing JS + HTML together makes sense.
3. Separation of concerns
	- Different components handle different data & logic
	- Vastly simplifies the process of working on complex apps
#### Two Rules
1. Name starts with uppercase character
	- The function name must start with an uppercase character
	- Multi-word names should be written in PascalCase (MyHeader)
	- It's recommended to pick a name that describes the UI building block (e.g. Header or MyHeader)
2. Returns "Renderable" content
	- The function must return a value that can be rendered by React
	- In most cases : return JSX
	- Also allowed : string, number, boolean, null, array of allowed values

### JSX
- JavaScript Syntax eXtension
- used to describe & create HTML elements in JS in a "declarative" way
- With React, we write "Declarative code"
- We define the target HTML structure & UI - not the steps to get there!
- But browser doesn't support JSX
- React projects come with a build process that transform JSX code (behind the scenes) to code that does work in browsers

### How components get rendered
`index.jsx`
```jsx
import ReactDOM from "react-dom/client";
// ReactDom is responsible for outputting the App component's content on the screen

import App from "./App.jsx";
import "./index.css";

// index.jsx file acts as the main entry point of React app
// since it's the first file to be loaded by index.html file
const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
// render method is called on an object created with createRoot method
// createRoot takes an existing HTML element as an input
// render method renders component and its nested components into html element
```
- Component Tree : a hierarchy of components. analyzed & rendered by React step by step
- Custom components don't show up in the actual rendered DOM 

### Built-in vs Custom components
- Bulit-in components
	- Name starts with a lowercase character
	- Only valid, officially defined HTML elements are allowed
	- Are rendered as DOM nodes by React
- Custom components
	- Name starts with uppercase character
	- Defined by devs, "wraps" built-in or other custom components
	- React "traverses" the component tree until it has only built-in components left
### Outputting Dynamic Content in JSX
- Static content
	- content that's hardcoded into the JSX code
	- can't change at runtime
- Dynamic content
	- Logic that produces the actual value is added to JSX
	- content / value is derived at runtime
### React Projects & "The build process"
- React projects must be "built" (via a build project) before deployment
- React code : dev writes & test
- Build process : 
	- changes & optimizes your code
	- transforms it such that it runs in the browser
	- also (potentially) optimizes other assets like CSS & image files
- Deployable files :
	- a collection of generated files that includes your optimized code and any other extra assets (e.g. css code files, optimized images etc)

### Configuring components with "props"
- React allow us to pass data to components via a concept called "props"
- JSX code that uses a component set component input data via "custom HTML attributes" (props)
- component defines internal logic + JSX code that should be rendered
- component function receives props parameter with configuration data
- props accept all value types
	- String values are passed with quotes
	- Number value : curly braces are required to pass the value as a number. If quotes were used, it would be considered a string
	- Object value : 
		- this is no special "double curly braces" syntax
		- It's simply a JS object passed as a value
- The value that will be passed for this parameter to component by React will be an object that has key-value pairs (keys are custom attributes, values are the attribute values)
- props are "custom HTML attributes" set on components
- React merges all props into a single object
- Props are passed to the component function as the first argument by React
```jsx
function CoreConcept(props) {
	return (
		<li>
			<img src={props.image} alt="" />
			<h3>{props.tilte}</h3>
			<p>{props.description} </p>
		</li>
	);
}
```
- or using object desctructuring
```jsx
function CoreConcept({ image, title, description }) {
	return (
		<li>
			<img src={image} alt="" />
			<h3>{title}</h3>
			<p>{description} </p>
		</li>
	);
}
```

### children props
- React will give a props object even if component doesn't get props set on component
- a prop set by React and not set with help of attributes
- refers to the content between component opening and closing tags
- React automatically passes a sepecial prop named "children" to every custom component
- its name must be "children"
#### children prop vs attribute prop
- children prop 
	- for components that take a single piece of renderable content, this approach it closer to "normal HTML usage"
	- This approach is espeically convenient when passing JSX code as a value to another component
- attribute prop
	- This approach makes sense if we got. multiple smaller pieces of information that must be passed to a component
	- Adding extra props instead of just wrapping the content with the component tags mean extra work
### React events
```jsx
export default function TapButton({ children }) {

	function handleClick() {}
	return (
		<li>
			{/* values for event prop is a function */}
			{/* that should be executed when that event occurs */}
			{/* we must not add parentheses instead use name of the function */}
			{/* we want to use the function as value */}
			{/* it should be executed by React when a click on this button occurs in the future */}
			{/* with parenthese, this function gets executed when this line gets executed */}
			<button onClick={handleClick}>{children}</button>
		</li>
	);

}
```
### Passing custom arguments to event function
```jsx
// with default export, import it without curly braces
import CoreConcept from "./components/CoreConcept";
import Header from "./components/Header/Header.jsx";
import TapButton from "./components/TapButton.jsx";
import { CORE_CONCEPTS } from "./data";


function App() {
  function handleSelect(selectedButton) {
    console.log(selectedButton);
  }

  // jsx - JS file that uses non-standard JS syntax

  return (
    // html code inside JavaScript
    <div>
      {/* we can use component like HTML element */}
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Time to get started!</h2>
          <ul>
            <CoreConcept
            title={CORE_CONCEPTS[0].title}
            description={CORE_CONCEPTS[0].description}
            image={CORE_CONCEPTS[0].image}
            />

            <CoreConcept {...CORE_CONCEPTS[1]} />
            <CoreConcept {...CORE_CONCEPTS[2]} />
            <CoreConcept {...CORE_CONCEPTS[3]} />
          </ul>
        </section>
        <section id="examples">
          <h2>Example</h2>
          <menu>
            {/* arrow function is the value passed as a value to onSelect, also to onClick in TapButton.jsx*/}
            {/* this function will be executed when the button is clicked */}
            {/* now we can control how it will be executed */}
            <TapButton onSelect={() => handleSelect("components")}>
            Components
            </TapButton>
            <TapButton onSelect={() => handleSelect("jsx")}>JSX</TapButton>
            <TapButton onSelect={() => handleSelect("props")}>Props</TapButton>
            <TapButton onSelect={() => handleSelect("state")}>State</TapButton>
          </menu>
        </section>
      </main>
    </div>
  );
}

export default App; 
```

### Behind the scene of React
- By default, react components execute ONLY once
- We have to "tell" React if a component should be executed again
- React compares the old output ("old JSX code") of component function to the new output("new JSX code") and applies any differences to the actual website UI
```jsx
// with default export, import it without curly braces

import CoreConcept from "./components/CoreConcept";
import Header from "./components/Header/Header.jsx";
import TapButton from "./components/TapButton.jsx";
import { CORE_CONCEPTS } from "./data";

function App() {

	let tabContent = "Please click a button";

	function handleSelect(selectedButton) {
		tabContent = selectedButton;
	}

	// jsx - JS file that uses non-standard JS syntax

	console.log("APP COMPONENT EXECUTING");
	return (
	// html code inside JavaScript
		<div>
			{/* we can use component like HTML element */}
			<Header />
			<main>
				<section id="core-concepts">
					<h2>Time to get started!</h2>
					<ul>
						<CoreConcept
						title={CORE_CONCEPTS[0].title}
						description={CORE_CONCEPTS[0].description}
						image={CORE_CONCEPTS[0].image}
						/>
						<CoreConcept {...CORE_CONCEPTS[1]} />
						<CoreConcept {...CORE_CONCEPTS[2]} />
						<CoreConcept {...CORE_CONCEPTS[3]} />
					</ul>
				</section>
				<section id="examples">
					<h2>Example</h2>
					<menu>
						{/* arrow function is the value passed as a value to onSelect, also to onClick in TapButton.jsx*/}
						{/* this function will be executed when the button is clicked */}
						{/* now we can control how it will be executed */}
						<TapButton onSelect={() => handleSelect("components")}>
						Components
						</TapButton>
						<TapButton onSelect={() => handleSelect("jsx")}>JSX</TapButton>
						<TapButton onSelect={() => handleSelect("props")}>Props</TapButton>
						<TapButton onSelect={() => handleSelect("state")}>State</TapButton>
					</menu>
					{tabContent}
				</section>
			</main>
		</div>
	);
}

  

export default App;
```
- this App component is not re-rendered -> the UI is not updated -> the concept of state appeared.
- we can't use a regular variable for updating UI
### React hooks & useState
- state is all about registering variables
- React hooks are regular functions
- They must be called inside React component functions, top level of component function
- Rules of Hooks
	- Only call hooks inside of component functions
	- Only call hooks on the top level - not be called in nested code statements (e.g. inside of if-statements)
- useState - helps us to manage component specific state, data stored by React
- when state is changed, it will trigger component function to re-execute.
- takes an argument, initial value, 
- returns an array with two elements,
	- current data snapshot for that component execution cycle, may change if the component function is executed again
	- state updating function : updates the stored value & "tells" React to re-execute the component function in which useState() was called
```jsx
// with default export, import it without curly braces

import { useState } from "react";
import CoreConcept from "./components/CoreConcept";
import Header from "./components/Header/Header.jsx";
import TapButton from "./components/TapButton.jsx";
import { CORE_CONCEPTS } from "./data";


function App() {

	const [selectedTopic, setSelectedTopic] = useState("Please click a button");

	function handleSelect(selectedButton) {
		setSelectedTopic(selectedButton);
		console.log(selectedTopic); // current state, not updated state value
	}

	// jsx - JS file that uses non-standard JS syntax

	console.log("APP COMPONENT EXECUTING");

	return (
		// html code inside JavaScript
		<div>
			{/* we can use component like HTML element */}
			<Header />
			<main>
				<section id="core-concepts">
					<h2>Time to get started!</h2>
					<ul>
						<CoreConcept
						title={CORE_CONCEPTS[0].title}
						description={CORE_CONCEPTS[0].description}
						image={CORE_CONCEPTS[0].image}
						/>
						<CoreConcept {...CORE_CONCEPTS[1]} />
						<CoreConcept {...CORE_CONCEPTS[2]} />
						<CoreConcept {...CORE_CONCEPTS[3]} />
					</ul>
				</section>
				<section id="examples">
					<h2>Example</h2>
					<menu>
						{/* arrow function is the value passed as a value to onSelect, also to onClick in TapButton.jsx*/}
						{/* this function will be executed when the button is clicked */}
						{/* now we can control how it will be executed */}
						<TapButton onSelect={() => handleSelect("components")}>
						Components
						</TapButton>
						<TapButton onSelect={() => handleSelect("jsx")}>JSX</TapButton>
						<TapButton onSelect={() => handleSelect("props")}>Props</TapButton>
						<TapButton onSelect={() => handleSelect("state")}>State</TapButton>
					</menu>
					{selectedTopic}
				</section>
			</main>
		</div>
	);
}

  

export default App;
```
- React schedules state update and it then re-executes this component function.
- the updated value will only be available after this app component function executed again.
### Rendering content conditionally
```jsx
// with default export, import it without curly braces
import { useState } from "react";
import CoreConcept from "./components/CoreConcept";
import Header from "./components/Header/Header.jsx";
import TapButton from "./components/TapButton.jsx";
import { CORE_CONCEPTS } from "./data";
import { EXAMPLES } from "./data";

function App() {
	const [selectedTopic, setSelectedTopic] = useState();

	function handleSelect(selectedButton) {
		setSelectedTopic(selectedButton);
		console.log(selectedTopic); // current state, not updated state value
	}

	// jsx - JS file that uses non-standard JS syntax

	console.log("APP COMPONENT EXECUTING");

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
	// html code inside JavaScript
	<div>
		{/* we can use component like HTML element */}
		<Header />
		<main>
			<section id="core-concepts">
				<h2>Time to get started!</h2>
				<ul>
					<CoreConcept
					title={CORE_CONCEPTS[0].title}
					description={CORE_CONCEPTS[0].description}
					image={CORE_CONCEPTS[0].image}
					/>
					<CoreConcept {...CORE_CONCEPTS[1]} />
					<CoreConcept {...CORE_CONCEPTS[2]} />
					<CoreConcept {...CORE_CONCEPTS[3]} />
				</ul>
			</section>
			<section id="examples">
				<h2>Example</h2>
				<menu>
					{/* arrow function is the value passed as a value to onSelect, also to onClick in TapButton.jsx*/}
					{/* this function will be executed when the button is clicked */}
					{/* now we can control how it will be executed */}
					<TapButton onSelect={() => handleSelect("components")}>
					Components
					</TapButton>
					<TapButton onSelect={() => handleSelect("jsx")}>JSX</TapButton>
					<TapButton onSelect={() => handleSelect("props")}>Props</TapButton>
					<TapButton onSelect={() => handleSelect("state")}>State</TapButton>
				</menu>
				{tabContent}
			</section>
		</main>
	</div>
	);
}


export default App;
```

### Outputting list data dynamically
- JSX is capable of dealing with arrays of renderable data
- function inside map function will be executed by JS for every item in that array
- inside that function, we can return the code we wanna transform that item
- must be used with key prop
- the value for key prop should be a value that uniquely identifies a list item
```jsx
<ul>
	{CORE_CONCEPTS.map((conceptItem) => (
	<CoreConcept key={conceptItem.title} {...conceptItem} />
	))}
</ul>
```
