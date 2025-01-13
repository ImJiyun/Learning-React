import { useFetcher } from "react-router";
import classes from "./NewsletterSignup.module.css";

function NewsletterSignup() {
  const fetcher = useFetcher();
  fetcher.submit();
  return (
    <form method="post" className={classes.newsletter}>
      <input
        type="email"
        placeholder="Sign up for newsletter..."
        aria-label="Sign up for newsletter"
      />
      <button>Sign up</button>
    </form>
  );
}

export default NewsletterSignup;
