import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Profile from "../Components/DashboardComponents/Profile";
import SideBar from "../Components/DashboardComponents/SideBar";
import { Button } from "flowbite-react";

import { AiOutlineMenu } from "react-icons/ai";
import BlogPost from "../Components/DashboardComponents/BlogPost";

const Dashboard = () => {
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

      {tab === "profile" && <Profile />}
      {tab === "createpost" && <BlogPost />}
    </div>
  );
};

export default Dashboard;
