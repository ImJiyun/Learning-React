// wrapper component
// props forwarding pattern
export default function Section({ title, children, ...props }) {
  // ... => group data into an object
  return (
    // props are not forwarded to this <section></section>
    // ... => spread data onto some other element
    <section {...props}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
