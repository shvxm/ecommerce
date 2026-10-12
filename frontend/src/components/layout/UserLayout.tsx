import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

const UserLayout = () => {
  return (
    <>
      <Navbar />

      <Outlet />
    </>
  );
};

export default UserLayout;