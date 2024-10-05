import React from "react";
import { ToastContainer } from "react-toastify";

import Graph from "../Components/Graph/Graph";
import Sidebar from "../Components/SideBar/Sidebar";

const Dashboard = () => {
  return (
    <div className="h-screen">
      <h1 className="absolute p-2 bg-white w-1/2 z-10">Food explorer</h1>

      <main className="h-full relative">
        <Graph />
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Dashboard;
