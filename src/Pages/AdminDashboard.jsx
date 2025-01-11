import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Button } from "flowbite-react";

import { AiOutlineMenu } from "react-icons/ai";
import SideBar from "../Components/DashboardComponents/SideBar";
import AllPost from "../Components/DashboardComponents/AdminDashboardComponents/AllPost";
import AllUser from "../Components/DashboardComponents/AdminDashboardComponents/AllUser";

const AdminDashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab"); //tab = profile
    if (tabUrl) {
      setTab(tabUrl); //profile
    }
  }, [location.search]);

  return (
    <div className="min-h-96">
      <div className="flex items-start justify-end pt-5 pr-5">
        <Button
          onClick={() => setIsOpen(true)}
          gradientDuoTone="purpleToBlue"
          className="self-center"
        >
          <AiOutlineMenu />
        </Button>
      </div>
      <SideBar isOpen={isOpen} handleClose={handleClose} />

      {tab === "allpost" && <AllPost />}
      {tab === "alluser" && <AllUser />}
    </div>
  );
};

export default AdminDashboard;
