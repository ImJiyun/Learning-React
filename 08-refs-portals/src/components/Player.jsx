import { useState, useRef } from "react";

export default function Player() {
  const playerName = useRef();
  // the value from useRef is a JS object which has a only "current" property

  const [enteredPlayerName, setEnteredPlayerName] = useState("");

  function handleClick() {
    setEnteredPlayerName(playerName.current.value);
    // current can access all the properties and methods connected to element
    playerName.current.value = ``; // imperative code
  }
  return (
    <section id="player">
      <h2>
        Welcome {enteredPlayerName ? enteredPlayerName : "unknown enitity"}
      </h2>
      <p>
        <input ref={playerName} type="text" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
