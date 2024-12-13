import { useState } from "react";
import { styled } from "styled-components";
// styled object has properties that can be mapped with HTML elements
// styled.div will create a div as a seperate component, but a component that will have any styles
// syntax : tagged templates (js feature) works as a input
// inside the literal, we can write standard CSS code, not camelCase

import Button from "./Button.jsx";
import Input from "./Input.jsx";

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
    <div
      id="auth-inputs"
      className="w-full max-w-sm p-8 mx-auto rounded shadwo=md bg-gradient-to-b from-stone-700 to-stone-800"
    >
      <div className="flex flex-col gap-2 mb-6">
        <Input
          label="Email"
          type="email"
          // style={{ backgroundColor: emailNotValid ? "#fed2d2" : "#d1d5db" }}
          invalid={emailNotValid}
          onChange={(event) => handleInputChange("email", event.target.value)}
        />

        <Input
          label="Password"
          type="password"
          // style={{ backgroundColor: emailNotValid ? "#fed2d2" : "#d1d5db" }}
          invalid={passwordNotValid}
          onChange={(event) =>
            handleInputChange("password", event.target.value)
          }
        />
      </div>
      <div className="flex justify-end gap-4">
        <button type="button" className="text-amber-400 hover:text-amber-500">
          Create a new account
        </button>
        <Button onClick={handleLogin}>Sign In</Button>
      </div>
    </div>
  );
}
