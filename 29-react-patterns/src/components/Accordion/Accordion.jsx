import { createContext, useContext, useState } from "react";
import AccordionItem from "./AccordionItem";
import AccordionTitle from "./AccordionTitle";
import AccordionContent from "./AccordionContent";

// AccorionContext is tied to the Accordion components
const AccordionContext = createContext();

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);

  // if the component is not wrapped by the Accordion component
  if (!ctx) {
    throw new Error(
      "Accordion-related components must be wrapped by <Accordion>"
    );
  }
  return ctx;
}

export default function Accordion({ children, className }) {
  const [openItemId, setOpenItemId] = useState();
  // It should be only one item that's open at the same time
  //  so we need to keep track of the open item

  function toggleItem(id) {
    // if the id is the same as the openItemId, set it to null (it means we clicked on the same item)
    //  otherwise, set it to the id
    setOpenItemId((prevId) => (prevId === id ? null : id));
  }

  const contextValue = {
    openItemId: openItemId,
    toggleItem,
  };

  //  a shell for the Accordion component
  return (
    <AccordionContext.Provider value={contextValue}>
      <ul className={className}>{children}</ul>
    </AccordionContext.Provider>
  );
}

// To make sure those components work together, we need to add them to the Accordion component
// add the AccordionItem to the Accordion component
// functions are just values
Accordion.Item = AccordionItem; // items now belongs to the Accordion component
// so now if we use AccordionItem outside of the Accordion component, it will throw an error
//  because it's not wrapped by the Accordion component
Accordion.Title = AccordionTitle;
Accordion.Content = AccordionContent;
