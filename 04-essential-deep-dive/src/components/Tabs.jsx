// ButtonsContainer = "menu" : setting default prop value
export default function Tabs({ children, buttons, ButtonsContainer = "menu" }) {
  // const ButtonsContainer = buttonsContainer; // this can be used as a custom component
  return (
    <>
      <ButtonsContainer>{buttons}</ButtonsContainer>
      {children}
    </>
  );
}
