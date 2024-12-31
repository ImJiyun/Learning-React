import { useRef, useState } from "react";

export default function Login() {
  const [emailIsInvalid, setEmailIsInValid] = useState();

  function handleSubmit(event) {
    const email = useRef();
    const password = useRef();
    // we get an event object for every event
    event.preventDefault(); // prevent the default browser behavior (generate and send HTTP request)
    const enteredEmail = email.current.value;
    const enteredPassword = password.current.value;
    // currnet property holds the actual connected value
    // every input element has value property
    console.log(enteredEmail, enteredPassword);
    // email.current.value = "";

    const emailIsValid = enteredEmail.includes("@");

    if (!emailIsInvalid) {
      setEmailIsInValid(true);
      return;
    }

    setEmailIsInValid(false);

    console.log("Sending HTTP request...");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" ref={email} />
          <div className="control-error">
            {emailIsInvalid && <p>Please enter a valid email address</p>}
          </div>
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
