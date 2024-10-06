import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Graph from "../Components/Graph/Graph";
import Header from "../Components/Header/Header";

const Dashboard = () => {
  return (
    <div className="h-screen overflow-y-hidden">
      <Header />

      <main className="h-full relative">
        <Graph />
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Dashboard;
