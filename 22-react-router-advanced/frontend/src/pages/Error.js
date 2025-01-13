import { useRouteError } from "react-router";
import PageContent from "../components/PageContent";
import MainNavigation from "../components/MainNavigation";

function ErrorPage() {
  const error = useRouteError();
  // what error object will have depend on thrown error

  let title = "An error occurred!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    // we don't have to parse data manunally when using json method
    message = JSON.parse(error.data).message;
  }

  if (error.status === 500) {
    title = "Not found!";
    message = "Could not find resource or page.";
  }
  return (
    <>
      <MainNavigation />
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </>
  );
}

export default ErrorPage;
