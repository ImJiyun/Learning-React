import MainNavigation from "../components/MainNavigation";
import { Outlet, useNavigation } from "react-router";

function RootLayout() {
  const navigation = useNavigation();
  // tells if we're in an active transition, if we're loading data
  // navigation object has state property

  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === "loading" && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
