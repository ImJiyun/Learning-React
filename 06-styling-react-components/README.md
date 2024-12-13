# Styling React Components

- styling with Vanilla CSS
- Scoping Styles with CSS Modules
- CSS-in-JS Styling with "Styled Components"
- Styling with Tailwind CSS
- Static & Dynamic (Conditional) Styling

### Styling React Components with Vanilla CSS - Pros and Cons

**Pros:**
1. **Decoupling from JSX:**  
   CSS is written separately from JSX, maintaining a clear separation of concerns and making the codebase cleaner.
   
2. **Familiarity:**  
   Developers can leverage existing CSS knowledge without learning additional frameworks or syntax.

3. **Team Collaboration:**  
   CSS can be created or maintained by a separate developer, requiring only minimal familiarity with the JSX structure.

---

**Cons:**
1. **Requirement to Know CSS:**  
   Developers need a good understanding of CSS, which might be a hurdle for those not proficient in it.

2. **Global Scope:**  
   CSS rules are not scoped to individual components. This can lead to name clashes where the same class name is used differently across components.

3. **Global Style Application:**  
   All styles are ultimately injected into the `<head>` of the document (e.g., by tools like Vite), which applies them globally, increasing the risk of unintentional style overrides.

#### Styling React app with inline styles
- one way of restricting style to one component
- apply CSS to directly to JSX code
- style prop takes a dynamic value and takes an object as a value
```jsx
import logo from "../assets/logo.png";

import "./Header.css"; // vite injects style

  

export default function Header() {

	return (
	
		<header>
	
			<img src={logo} alt="A canvas" />
	
			<h1>ReactArt</h1>
	
			<p style={{ color: "red" }}>A community of artists and art-lovers.</p>
	
		</header>
	
	);

}
```


**Pros:**

1. **Quick & Easy to Use:**  
   Adding styles directly to JSX is straightforward, making it ideal for quick prototyping or minor adjustments.

2. **Scoped to Elements:**  
   Styles apply only to the specific element they are assigned to, eliminating the risk of global CSS conflicts.

3. **Dynamic Styling:**  
   Inline styles easily support dynamic and conditional styling using JavaScript expressions.

---

**Cons:**

1. **CSS Knowledge Required:**  
   Developers need a working knowledge of CSS properties and values.

2. **Repetition:**  
   Each element must be styled individually, which can lead to repetitive and verbose code, especially for complex designs.

3. **Tight Coupling of CSS & JSX:**  
   Inline styles mix presentation with structure, making the code less modular and harder to maintain compared to external or modular CSS.
#### Dynamic & Conditional Styling with CSS
```jsx
import { useState } from "react";

  

export default function AuthInputs() {

const [enteredEmail, setEnteredEmail] = useState("");

const [enteredPassword, setEnteredPassword] = useState("");

const [submitted, setSubmitted] = useState(false);

  

function handleInputChange(identifier, value) {

	if (identifier === "email") {
	
		setEnteredEmail(value);
	
	} else {
	
		setEnteredPassword(value);
	
	}

}

  

function handleLogin() {

	setSubmitted(true);

}

  

const emailNotValid = submitted && !enteredEmail.includes("@");

const passwordNotValid = submitted && enteredPassword.trim().length < 6;

  

return (

	<div id="auth-inputs">
	
		<div className="controls">
		
		<p>
		
		{/* add class conditionally */}
		
		{/* label class should always applied */}
		
		<label className={`label ${emailNotValid ? "invalid" : ""}`}>
		
		Email
		
		</label>
		
		<input
		
		type="email"
		
		// style={{ backgroundColor: emailNotValid ? "#fed2d2" : "#d1d5db" }}
		
		className={emailNotValid ? "invalid" : undefined}
		
		onChange={(event) => handleInputChange("email", event.target.value)}
		
		/>
		
		</p>
		
		<p>
		
		<label className={`label ${emailNotValid ? "invalid" : ""}`}>
		
		Password
		
		</label>
		
		<input
		
		type="password"
		
		// style={{ backgroundColor: emailNotValid ? "#fed2d2" : "#d1d5db" }}
		
		className={passwordNotValid ? "invalid" : undefined}
		
		onChange={(event) =>
		
		handleInputChange("password", event.target.value)
		
		}
		
		/>
		
		</p>
		
		</div>
		
		<div className="actions">
		
		<button type="button" className="text-button">
		
		Create a new account
		
		</button>
		
		<button className="button" onClick={handleLogin}>
		
		Sign In
		
		</button>
		
		</div>
	
	</div>

);

}
```

### CSS Modules

- **Scoped Styling:** CSS Modules allow you to write vanilla CSS with file-specific scoping.
- **React Integration:** A React feature that enforces component-specific scoping through the build process.
- **File Naming Convention:** Name CSS files as `component-name.module.css` to signal the build process that the file uses CSS Modules.
- **Importing CSS Modules:**    
    `import classes from "./Header.module.css"; // Vite (or Webpack) injects the styles`
    
- **Classes Object:** During the build process, the CSS class names are transformed into unique names to prevent conflicts.
    - The `classes` object will contain the transformed class names.

#### `Header.js` Component

```jsx
import logo from "../assets/logo.png";
import classes from "./Header.module.css";

export default function Header() {
  return (
    <header>
      <img src={logo} alt="A canvas" />
      <h1>ReactArt</h1>
      <p className={classes.paragraph}>
        A community of artists and art-lovers.
      </p>
    </header>
  );
}

```

- **Result:** The `paragraph` class in the CSS file is scoped uniquely to the `Header` component, ensuring it doesn't clash with styles from other components.

**Pros:**

1. **Scoped Styling:**  
   CSS Modules automatically scope styles to the component, preventing clashes with other styles across the app.

2. **Familiar Syntax:**  
   You can write CSS as usual, leveraging the full power of vanilla CSS, without needing to learn a new styling paradigm.

3. **Separation of Concerns:**  
   CSS code is decoupled from JSX, enabling modularity and easier maintenance. Developers can work on styles independently of component logic.

4. **Reusable Styles:**  
   Styles can be shared within a component or across components, while ensuring uniqueness.

5. **Tooling Support:**  
   Tools like Vite or Webpack handle the generation of unique class names automatically during the build process.

---

**Cons:**

1. **CSS Knowledge Required:**  
   Developers must be familiar with CSS, which could pose a challenge for those with limited experience.

2. **File Management Overhead:**  
   Using CSS Modules may result in numerous small CSS files, potentially leading to clutter in larger projects.

3. **Naming Conventions:**  
   Adhering to consistent file naming (e.g., `.module.css`) and importing conventions is essential, which might require initial setup or enforcement of guidelines.

---

### Styled Components (Third-Party Package)
- Styled-components allow defining CSS rules and styles in special components using JavaScript.
- Install the package using:
  ```bash
  npm install styled-components
  ```
- Styled components forward all props to the underlying built-in JSX elements.

---

### Key Points:
1. **Creation of Styled Components**:
   - `styled` object has properties corresponding to HTML elements (e.g., `styled.div`, `styled.label`).
   - These are React components with attached styles.
   - **Syntax**: Uses tagged template literals to write CSS inside backticks. 
     - Write standard CSS (not camelCase).
     - Example:
       ```jsx
       const Component = styled.div`
           display: flex;
           margin: 10px;
       `;
       ```

2. **Styled Components in Action**:
   - Import `styled-components` to define custom styled elements.
   - Styled elements behave like React components and support additional props.

---

### Code

```jsx
import { useState } from "react";
import styled from "styled-components";

// Styled component for div container
const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

// Styled component for label
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b7280;
`;

// Styled component for input
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  line-height: 1.5;
  background-color: #d1d5db;
  color: #374151;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &.invalid {
    background-color: #fed2d2;
    border-color: #e11d48;
  }
`;

export default function AuthInputs() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Update state based on input changes
  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value);
    } else {
      setEnteredPassword(value);
    }
  }

  // Handle login submission
  function handleLogin() {
    setSubmitted(true);
  }

  // Validation checks
  const emailNotValid = submitted && !enteredEmail.includes("@");
  const passwordNotValid = submitted && enteredPassword.trim().length < 6;

  return (
    <div id="auth-inputs">
      <ControlContainer>
        {/* Email input */}
        <p className="paragraph">
          <Label className={`label ${emailNotValid ? "invalid" : ""}`}>
            Email
          </Label>
          <Input
            type="email"
            className={emailNotValid ? "invalid" : undefined}
            onChange={(event) => handleInputChange("email", event.target.value)}
          />
        </p>

        {/* Password input */}
        <p>
          <Label className={`label ${passwordNotValid ? "invalid" : ""}`}>
            Password
          </Label>
          <Input
            type="password"
            className={passwordNotValid ? "invalid" : undefined}
            onChange={(event) =>
              handleInputChange("password", event.target.value)
            }
          />
        </p>
      </ControlContainer>

      {/* Action buttons */}
      <div className="actions">
        <button type="button" className="text-button">
          Create a new account
        </button>
        <button className="button" onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
}
```


---

### **Dynamic & Conditional Styling with Styled Components**

#### **Key Concepts**

1. **Inject Props into Styled Components**  
   - Props can be used to make the styles dynamic based on conditions or state.  
   - Styled components accept props and allow you to define conditional styles using them.

2. **Avoid Prop Clashes**
   - Built-in HTML attributes (e.g., `invalid`) can conflict with custom props.  
   - Use a naming convention like a dollar sign (`$`) prefix for custom props to avoid clashes.

#### **Code**

```jsx
import { useState } from "react";
import styled from "styled-components";

// Styled component for a container
const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

// Styled component for a label
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $invalid }) => ($invalid ? "#f87171" : "#6b7280")}; // Dynamic color
`;

// Styled component for an input
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  line-height: 1.5;
  background-color: ${({ $invalid }) => ($invalid ? "#fed2d2" : "#d1d5db")}; // Conditional background
  color: ${({ $invalid }) => ($invalid ? "#ef4444" : "#374151")};           // Conditional text color
  border: 1px solid ${({ $invalid }) => ($invalid ? "#f73f3f" : "transparent")}; // Conditional border
  border-radius: 0.25rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export default function AuthInputs() {
  // States for managing input values and form submission status
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle input value updates
  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value);
    } else {
      setEnteredPassword(value);
    }
  }

  // Handle form submission
  function handleLogin() {
    setSubmitted(true);
  }

  // Validation conditions
  const emailNotValid = submitted && !enteredEmail.includes("@");
  const passwordNotValid = submitted && enteredPassword.trim().length < 6;

  return (
    <div id="auth-inputs">
      <ControlContainer>
        <p className="paragraph">
          {/* Email Input */}
          <Label $invalid={emailNotValid}>Email</Label>
          <Input
            type="email"
            $invalid={emailNotValid}
            onChange={(event) => handleInputChange("email", event.target.value)}
          />
        </p>
        <p>
          {/* Password Input */}
          <Label $invalid={passwordNotValid}>Password</Label>
          <Input
            type="password"
            $invalid={passwordNotValid}
            onChange={(event) => handleInputChange("password", event.target.value)}
          />
        </p>
      </ControlContainer>
      <div className="actions">
        <button type="button" className="text-button">
          Create a new account
        </button>
        <button className="button" onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
}
```

---

### **Notes on Key Syntax**

1. **Tagged Template Literals**
   - Styled components use tagged template literals for CSS inside JavaScript.  
   - Example: `` styled.div`CSS styles here...` ``.

2. **Dynamic Styling with Props**
   - Props passed to a styled component can dynamically adjust styles:
     ```jsx
     color: ${({ $invalid }) => ($invalid ? "red" : "green")};
     ```

3. **Styling with Custom Prop Conventions**
   - Custom props use a dollar sign prefix (`$`) to avoid conflicts with built-in HTML attributes like `type`, `value`, or `invalid`.

4. **React's `useState` Hook for Form State**
   - `useState` is used to track user input and submission state.

5. **Validation Logic**
   - `emailNotValid`: Checks if the email doesn't include `@` after submission.
   - `passwordNotValid`: Ensures the password has a minimum length of 6.

---

### **Styled Components: Pseudo-selectors, Nested Rules & Media Queries**

#### **1. Pseudo-selectors**
- Styled-components allow the use of pseudo-selectors (e.g., `:hover`, `:focus`, `:disabled`) directly within the CSS-in-JS syntax.
- Example:
  ```jsx
  const Button = styled.button`
    padding: 1rem 2rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #1f2937;
    background-color: #f0b322;
    border-radius: 6px;
    border: none;

    &:hover {
      background-color: #f0920e; /* Change color on hover */
    }
  `;
  ```

  **Explanation:**
  - The `&` refers to the current component (`Button` in this case).
  - When the button is hovered, the background color changes dynamically.

#### **2. Nested Rules**
- Styled-components support nested selectors for child elements or states.
- Example:
  ```jsx
  const ControlContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    p {
      margin: 0;

      &:last-child {
        margin-bottom: 0; /* Remove margin for the last paragraph */
      }
    }
  `;
  ```

  **Explanation:**
  - `p` styles all `<p>` tags within the `ControlContainer`.
  - `&:last-child` ensures the last `<p>` element within the container has no bottom margin.

#### **3. Media Queries**
- Styled-components allow you to define media queries for responsive design directly within the component.
- Example:
  ```jsx
  const Input = styled.input`
    width: 100%;
    padding: 0.75rem 1rem;

    @media (max-width: 768px) {
      width: 90%; /* Adjust width for smaller screens */
    }
  `;
  ```

  **Explanation:**
  - `@media` adjusts the styles of the `Input` component based on the screen width.
  - In this case, the `Input` width reduces to 90% when the viewport is 768px or smaller.

---

### **Code**

```jsx
import { useState } from "react";
import styled from "styled-components";

// Container for inputs
const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  p {
    margin: 0;

    &:last-child {
      margin-bottom: 0; /* Remove margin for the last paragraph */
    }
  }
`;

// Styled label with dynamic and nested styling
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $invalid }) => ($invalid ? "#f87171" : "#6b7280")};
`;

// Input with dynamic styles and media query for responsiveness
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  line-height: 1.5;
  background-color: ${({ $invalid }) => ($invalid ? "#fed2d2" : "#d1d5db")};
  color: ${({ $invalid }) => ($invalid ? "#ef4444" : "#374151")};
  border: 1px solid ${({ $invalid }) => ($invalid ? "#f73f3f" : "transparent")};
  border-radius: 0.25rem;

  &:focus {
    outline: 2px solid ${({ $invalid }) => ($invalid ? "#f87171" : "#2563eb")}; /* Add focus outline */
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

// Button with hover pseudo-selector
const Button = styled.button`
  padding: 1rem 2rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #1f2937;
  background-color: #f0b322;
  border-radius: 6px;
  border: none;

  &:hover {
    background-color: #f0920e;
  }
`;

export default function AuthInputs() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value);
    } else {
      setEnteredPassword(value);
    }
  }

  function handleLogin() {
    setSubmitted(true);
  }

  const emailNotValid = submitted && !enteredEmail.includes("@");
  const passwordNotValid = submitted && enteredPassword.trim().length < 6;

  return (
    <div id="auth-inputs">
      <ControlContainer>
        <p>
          <Label $invalid={emailNotValid}>Email</Label>
          <Input
            type="email"
            $invalid={emailNotValid}
            onChange={(event) => handleInputChange("email", event.target.value)}
          />
        </p>
        <p>
          <Label $invalid={passwordNotValid}>Password</Label>
          <Input
            type="password"
            $invalid={passwordNotValid}
            onChange={(event) => handleInputChange("password", event.target.value)}
          />
        </p>
      </ControlContainer>
      <div className="actions">
        <button type="button" className="text-button">
          Create a new account
        </button>
        <Button onClick={handleLogin}>Sign In</Button>
      </div>
    </div>
  );
}
```

---

### Reusable Components  & Component combinations
Outsourcing reusable components allows different parts of the application to utilize them effectively.  

---

### Button.jsx  
Reusable `Button` component styled using `styled-components`.  

```jsx
import { styled } from "styled-components";

const Button = styled.button`
  padding: 1rem 2rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 0.25rem;
  color: #1f2937;
  background-color: #f0b322;
  border: none;
  &:hover {
    background-color: #f0920e;
  }
`;

export default Button;
```

---

### AuthInputs.jsx  
The `AuthInputs` component combines multiple reusable components (`Button` and `Input`) and provides the logic for authentication inputs.  

```jsx
import { useState } from "react";
import { styled } from "styled-components";
import Button from "./Button.jsx";
import Input from "./Input.jsx";

// Styled container for input fields
const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export default function AuthInputs() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes dynamically based on field type
  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value);
    } else {
      setEnteredPassword(value);
    }
  }

  // Handle login submission
  function handleLogin() {
    setSubmitted(true);
  }

  const emailNotValid = submitted && !enteredEmail.includes("@");
  const passwordNotValid = submitted && enteredPassword.trim().length < 6;

  return (
    <div id="auth-inputs">
      <ControlContainer>
        <Input
          label="Email"
          type="email"
          invalid={emailNotValid}
          onChange={(event) => handleInputChange("email", event.target.value)}
        />
        <Input
          label="Password"
          type="password"
          invalid={passwordNotValid}
          onChange={(event) => handleInputChange("password", event.target.value)}
        />
      </ControlContainer>
      <div className="actions">
        <button type="button" className="text-button">
          Create a new account
        </button>
        <Button onClick={handleLogin}>Sign In</Button>
      </div>
    </div>
  );
}
```

---

### Key Notes  
1. **Reusability**: Components like `Button` and `Input` are designed to be reused across the application with customizable styles and behavior.  
2. **Styling**: `styled-components` enable encapsulated styling for React components, avoiding style conflicts.  
3. **Dynamic Logic**: Functions like `handleInputChange` and validation logic (`emailNotValid`, `passwordNotValid`) adapt to user input, improving interactivity.  
4. **Separation of Concerns**: Styling, logic, and layout are modular, making the code easier to maintain and expand.  

--- 

#### Styled components - Pros & Cons
- Pros
	- Quick & easy to add
	- You continue "thinking in React" (-> configurable style functions)
	- Styles are scoped to components -> No CSS rule clashes
- Cons
	- need to know CSS
	- No clear separation of React & CSS code
	- tend to end up with many relatively small "wrapper" components


---
### Tailwind CSS Notes

**Overview**  
Tailwind CSS is a utility-first CSS framework that simplifies styling by using predefined utility classes, eliminating the need to write traditional CSS rules.

**Installation**  
To install Tailwind CSS:  
```bash
npm install -D tailwindcss postcss autoprefixer  
npx tailwindcss init -p
```

**Advantages**  
- **Ease of Use**: Minimal knowledge of CSS is required.  
- **Fast Development**: Utility-first approach speeds up the design process.  
- **No Style Conflicts**: Avoids component style clashes by not relying on custom CSS rules.  
- **Customizable**: Highly configurable and extensible for various project needs.  

**Disadvantages**  
- **Verbose Class Names**: Utility classes can lead to long and complex `className` values.  
- **JSX Dependency**: Any style changes require modifications in JSX, increasing coupling.  
- **Repetitive Code**: May lead to multiple small "wrapper" components or frequent copy-pasting of similar styles.