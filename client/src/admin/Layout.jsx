import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import "./styles/Layout.css";

export default function Layout() {
  return (
    <div className="admin-layout">

      <Sidebar />

      <div className="admin-main">


        <div className="admin-content">

          <Outlet />

        </div>

      </div>

    </div>
  );
}