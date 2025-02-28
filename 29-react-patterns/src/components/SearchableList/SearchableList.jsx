import { useRef, useState } from "react";

function SearchableList({ items, itemKeyFn, children }) {
  const lastChange = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  // convert all items to strings and filter them based on the search term
  const searchResults = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleChange(event) {
    // if there is an onging timer, clear it, and start a new one
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }
    // debounce the search term to avoid searching on every key press
    // delay the search term update by 500ms

    // store tiemer id in ref to clear it on every key press
    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      setSearchTerm(event.target.value);
    }, 500);
  }

  return (
    <div className="searchable-list">
      <input type="search" placeholder="Search" onChange={handleChange} />
      <ul>
        {searchResults.map((item) => (
          <li key={itemKeyFn(item)}>{children(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableList;
