import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import classes from "./Root.module.css";

function RootLayout() {
  // Outlet tells where child route elements should be rendered to
  return (
    <>
      <MainNavigation />
      <main className={classes.content}>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
