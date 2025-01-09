import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <h1>My Home Page</h1>
      {/* the href in a tag sends a new request to the server and it will be an unnecessay work under SPA */}
      {/* the Link listens for clinks on that element, prevents the browser default of sending a HTTP request */}
      <p>
        Go to <Link to="/products">the list of products</Link>
      </p>
    </>
  );
}

export default HomePage;
