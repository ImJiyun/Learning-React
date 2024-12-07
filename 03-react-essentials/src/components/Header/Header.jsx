import reactImg from "../../assets/react-core-concepts.png";
import "./Header.css"; // split css file to smaller, then import it where it belongs to
// NOTE : importing CSS file in a Component file will not scope these styles to that Component
// because these styles in header.css file are not scoped and limited to the Header component
const reactDescriptions = ["Fundamental", "Crucial", "Core"];

function genRendomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

export default function Header() {
  const description = reactDescriptions[genRendomInt(2)];
  return (
    <header>
      <img src={reactImg} alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        {description} React concepts you will need for almost any app you are
        going to build!
      </p>
    </header>
  );
}
