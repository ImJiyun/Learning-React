## Working with Forms 
### What's So Difficult?

#### 1. Form Submission
- **Handling submission** is relatively easy:
    - Entered values can be managed via **state**.
    - Alternatively, they can be extracted via **refs**.
    - Or via **FormData** and native browser features.

#### 2. Input Validation
- Providing a good user experience is tricky:
    - **Validate on every keystroke**: Errors may be shown too early.
    - **Validate on last focus**: Errors may be shown too long.
    - **Validate on form submission**: Errors may be shown too late.

---

### Handling Submissions

```jsx
export default function Login() {

  function handleSubmit(event) {
    event.preventDefault(); // Prevents the default browser behavior
    // Add custom submission logic here
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat" type="reset">Reset</button>
        <button className="button" type="submit">Login</button>
      </p>
    </form>
  );
}
```

---

### Key Points

#### Reserved Names in JS
- `class` and `for` are reserved names in JavaScript.
    - Use `className` and `htmlFor` as props names.

#### Default Browser Behaviors
- Buttons within form elements automatically trigger a form submission.
    - A browser creates and sends an HTTP request with the entered form data.
    - **Why is this a problem?**
        - This default behavior can conflict with custom submission logic.

#### How to Prevent Default Behavior
- Set `type="button"` on a button to prevent it from submitting the form.
- Use the `onSubmit` event on the `<form>` element to:
    - Intercept the form's `submit` event.
    - React whenever the form is submitted.

```jsx
export default function Login() {
  function handleSubmit(event) {
    event.preventDefault(); // prevent the default browser behavior
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}
```

---

### Handling User Input

#### 1. Using `useState`
```jsx
import { useState } from "react";

export default function Login() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleEmailChange(event) {
    setEnteredEmail(event.target.value);
    console.log("User email: " + enteredEmail);
  }

  function handlePasswordChange(event) {
    setEnteredPassword(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={handleEmailChange}
            value={enteredEmail}
          />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}
```
Creating separate handling functions for all inputs might end up with a lot of handling functions.

---

#### 2. Using Combined State
```jsx
import { useState } from "react";

export default function Login() {
  const [enteredValues, setEnteredValues] = useState({
    email: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log(enteredValues);
  }

  function handleInputChange(identifier, value) {
    setEnteredValues((prevValues) => ({
      ...prevValues,
      [identifier]: value,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={(event) => handleInputChange("email", event.target.value)}
            value={enteredValues.email}
          />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={(event) =>
              handleInputChange("password", event.target.value)
            }
            value={enteredValues.password}
          />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}
```

---

#### 3. Using `ref`
- Requires less code than using `useState`.
```jsx
import { useRef } from "react";

export default function Login() {
  const email = useRef();
  const password = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    const enteredEmail = email.current.value;
    const enteredPassword = password.current.value;
    console.log(enteredEmail, enteredPassword);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" ref={email} />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" ref={password} />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}
```

---

#### Getting Values via `FormData`
When a form has many inputs, it’s tricky to use `state` or `refs`. `FormData` is a built-in feature in browsers.
```jsx
export default function Signup() {
  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target); // the target of the submit event is form
    const acquisitionChannel = fd.getAll("acquisition");
    const data = Object.fromEntries(fd.entries());
    data.acquisition = acquisitionChannel;

    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Welcome on board!</h2>
      {/* Additional form inputs */}
    </form>
  );
}
```

---

