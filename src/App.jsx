import React from "react";
import Header from "./Components/Header";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";

import Blogs from "./Pages/Blogs";

import FooterCom from "./Components/Footer";
import PrivateRoute from "./Components/Authentication/PrivateRoute";
import SignIn from "./Pages/Authentication/SignIn";
import SignUp from "./Pages/Authentication/SignUp";
import { Toaster } from "react-hot-toast";
import Search from "./Pages/Search";
import Nopage from "./Pages/Nopage";
import AdminRoute from "./Components/Authentication/AdminRoute";
import AdminDashboard from "./Pages/AdminDashboard";

const App = () => {
  const location = useLocation().pathname;

  // Pages where the Header should be hidden
  const hidePaths = ["/signin", "/signup"];
  const hideHeader = hidePaths.includes(location);
  return (
    <div>
      {!hideHeader && <Header />}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/not-authorized" element={<Nopage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
      <FooterCom />
    </div>
  );
};

export default App;
