import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 backdrop-contrast-50 z-10 flex justify-center items-center">
      <span className="material-symbols-outlined text-3xl text-blue-500 animate-spin">
        progress_activity
      </span>
    </div>
  );
};

export default Loader;
