import React from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-black dark:text-white dark:bg-gray-800 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
