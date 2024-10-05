import React from "react";
import { ToastContainer } from "react-toastify";

import Graph from "../Components/Graph/Graph";

const Dashboard = () => {
  return (
    <div className="h-screen overflow-y-hidden">
      <h1 className="p-3 border-b bg-white w-full z-10 font-bold text-xl shadow-md">
        Food explorer
      </h1>

      <main className="h-full relative">
        <Graph />
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Dashboard;
