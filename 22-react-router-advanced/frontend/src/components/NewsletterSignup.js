import { useFetcher } from "react-router";
import classes from "./NewsletterSignup.module.css";
import { useEffect } from "react";

function NewsletterSignup() {
  const fetcher = useFetcher(); // gives an object
  const { data, state } = fetcher;

  useEffect(() => {
    if (state === "idle" && data && data.message) {
      window.alert(data.message);
    }
  }, [data, state]);

  return (
    // if we use Form component, we would have to include action in all routes because this component is part of main navigation
    // fetcher.Form will not initialize a route transition
    // without navigating to the page to which the loader or action belongs
    <fetcher.Form
      method="post"
      action="/newsletter"
      className={classes.newsletter}
    >
      <input
        type="email"
        placeholder="Sign up for newsletter..."
        aria-label="Sign up for newsletter"
      />
      <button>Sign up</button>
    </fetcher.Form>
  );
}

export default NewsletterSignup;
