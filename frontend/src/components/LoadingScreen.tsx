import React from "react";

export const Loadingscreen = () => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="rounded-2xl flex flex-col bg-gray-900 px-40 py-10 justify-center items-center ">

      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4">Loading...</p>
        </div>
    </div>
  );
}
