import { useState } from "react";

// onChange prop hold a function from App
export default function UserInput({ onChange, userInput }) {
  //   const [userInput, setUserInput] = useState({
  //     initialInvestment: 10000,
  //     annualInvestment: 1200,
  //     expectedReturn: 6,
  //     duration: 10,
  //   });

  //   const handleChange = (inputIdentifier, newValue) => {
  //     setUserInput((prevUserInput) => {
  //       return {
  //         ...prevUserInput,
  //         [inputIdentifier]: newValue,
  //       };
  //     });
  //   };

  return (
    <section id="user-input">
      <div className="input-group">
        <p>
          <label>INITIAL INVESTMENT</label>
          <input
            type="number"
            value={userInput.annualInvestment}
            onChange={(event) =>
              onChange("annualInvestment", event.target.value)
            }
            required
          />
        </p>
        <p>
          <label>ANNUAL INVESTMENT</label>
          <input
            type="number"
            value={userInput.expectedReturn}
            onChange={(event) => onChange("expectedReturn", event.target.value)}
            required
          />
        </p>
      </div>
      <div className="input-group">
        <p>
          <label>EXPECTED RETURN</label>
          <input
            type="number"
            value={userInput.initialInvestment}
            onChange={(event) =>
              onChange("initialInvestment", event.target.value)
            }
            required
          />
        </p>
        <p>
          <label>DURATION</label>
          <input
            type="number"
            value={userInput.duration}
            onChange={(event) => onChange("duration", event.target.value)}
            required
          />
        </p>
      </div>
    </section>
  );
}
