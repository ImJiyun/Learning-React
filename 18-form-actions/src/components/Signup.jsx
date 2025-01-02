import { useActionState } from "react";
import {
  isEmail,
  isNotEmpty,
  isEqualToOtherValue,
  hasMinLength,
} from "../util/validation.js";

// Moved the action function to the top of the file
// if the function uses props or states, it should be defined inside the component
function signupAction(prevFormState, formData) {
  // to prevent error, prevFormState is passed as an argument

  // formData is an object with all the form fields
  // set name properties on the form fields to get the values
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");
  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");
  const role = formData.get("role");
  const terms = formData.get("terms");
  const acquisitionChannel = formData.getAll("acquisition");
  // after submitting form, the fields are cleared

  let errors = [];

  if (!isEmail(email)) {
    errors.push("Invalid email address.");
  }

  if (!isNotEmpty(password) || !hasMinLength(password, 8)) {
    errors.push("You must provide a password with at least six characters.");
  }

  if (!isEqualToOtherValue(password, confirmPassword)) {
    errors.push("Passwords do not match.");
  }

  if (!isNotEmpty(firstName) || !isNotEmpty(lastName)) {
    errors.push("Please provide both your first and last name.");
  }

  if (!isNotEmpty(role)) {
    errors.push("Please select a role.");
  }

  if (!terms) {
    errors.push("You must agree to the terms and conditions.");
  }

  if (acquisitionChannel.length === 0) {
    errors.push("Please select at least one acquistion channel.");
  }

  if (errors.length > 0) {
    // enteredValues are used for the form fields to be filled with the previous values
    return {
      errors,
      enteredValues: {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        role,
        terms,
        acquisitionChannel,
      },
    };
  }

  return { errors: null };
}
export default function Signup() {
  //how do we hold the value returned from the action function?
  // 1st argument is the action function
  // 2nd argument is the initial state
  const [formState, formAction, pending] = useActionState(signupAction, {
    errors: null,
  });
  // 1st returned value : the form state
  // 2nd returned value : the form action (is passed to action prop of the form)
  // 3rd returned value : pending, true of false depending on the state of the form

  return (
    <form action={formAction}>
      <h2>Welcome on board!</h2>
      <p>We just need a little bit of data from you to get you started 🚀</p>

      <div className="control">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          defaultValue={formState.enteredValues?.email}
        />
      </div>

      <div className="control-row">
        <div className="control">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            defaultValue={formState.enteredValues?.password}
          />
        </div>

        <div className="control">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            name="confirm-password"
            defaultValue={formState.enteredValues?.confirmPassword}
          />
        </div>
      </div>

      <hr />

      <div className="control-row">
        <div className="control">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            defaultValue={formState.enteredValues?.firstName}
          />
        </div>

        <div className="control">
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            defaultValue={formState.enteredValues?.lastName}
          />
        </div>
      </div>

      <div className="control">
        <label htmlFor="phone">What best describes your role?</label>
        <select
          id="role"
          name="role"
          defaultValue={formState.enteredValues?.role}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="employee">Employee</option>
          <option value="founder">Founder</option>
          <option value="other">Other</option>
        </select>
      </div>

      <fieldset>
        <legend>How did you find us?</legend>
        <div className="control">
          <input
            type="checkbox"
            id="google"
            name="acquisition"
            value="google"
            defaultChecked={formState.enteredValues?.acquisitionChannel.includes(
              "google"
            )}
          />
          <label htmlFor="google">Google</label>
        </div>

        <div className="control">
          <input
            type="checkbox"
            id="friend"
            name="acquisition"
            value="friend"
            defaultChecked={formState.enteredValues?.acquisitionChannel.includes(
              "other"
            )}
          />
          <label htmlFor="friend">Referred by friend</label>
        </div>

        <div className="control">
          <input type="checkbox" id="other" name="acquisition" value="other" />
          <label htmlFor="other">Other</label>
        </div>
      </fieldset>

      <div className="control">
        <label htmlFor="terms-and-conditions">
          <input
            type="checkbox"
            id="terms-and-conditions"
            name="terms"
            defaultChecked={formState.enteredValues?.terms}
          />
          I agree to the terms and conditions
        </label>
      </div>

      {formState.errors && (
        <ul className="error">
          {formState.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Reset
        </button>
        <button className="button">Sign up</button>
      </p>
    </form>
  );
}
