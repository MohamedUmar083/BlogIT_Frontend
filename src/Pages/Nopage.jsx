import React from "react";

const Nopage = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-10">
      <div className="text-center">
        <h1 className="text-6xl md:text-9xl font-extrabold text-gray-800">
          404
        </h1>
        <p className="mt-4 text-2xl md:text-4xl text-gray-600">
          Page Not Found
        </p>
        <p className="mt-2 text-lg md:text-xl text-gray-500">
          The page you are looking for doesn't exist.
        </p>
      </div>
    </div>
  );
};

export default Nopage;
