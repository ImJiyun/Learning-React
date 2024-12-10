import { useState } from "react";
export default function Player({
  initialName,
  symbol,
  isActive,
  onChangeName,
}) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    // setIsEditing(!isEditing); // cause React to re-execute Player function and to reevaluate JSX code and see if anything changed
    // if anything changed, those changes will be reflected to the real DOM and other component functions
    // if child component changes, parent component doesn't care about that
    setIsEditing((editing) => !editing); // get the latest state value
    // this function will be called by React and will automatically get the current value state
    // will return the new state

    if (isEditing) {
      onChangeName(symbol, playerName);
    }
  };

  const handleChange = (event) => {
    console.log(event);
    // target property : refers to the element that emited the event (input element here)
    // input element has a value property
    setPlayerName(event.target.value);
  };

  let editablePlayerName = <span className="player-name">{playerName}</span>;
  // let btnCaption = "Edit";

  if (isEditing) {
    // value prop : set the value that's shown in input field
    // onChange will trigger for every keystroke and will provide us with an event object that contains the value entered by user
    editablePlayerName = (
      <input type="text" required value={playerName} onChange={handleChange} />
    );
    // btnCaption = "Save";
  }
  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {editablePlayerName}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  );
}
