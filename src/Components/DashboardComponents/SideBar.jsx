import { Sidebar, Drawer } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../Redux/Slice/userSlice";
import toast from "react-hot-toast";
import {
  BsPersonCircle,
  BsPersonVcard,
  BsPlusCircle,
  BsPostcard,
  BsPower,
} from "react-icons/bs";

const SideBar = ({ isOpen, handleClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");

  //Drawer Property

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab"); //tab = profile
    if (tabUrl) {
      setTab(tabUrl); //profile
    }
  }, [location.search]);

  const handleSignOut = () => {
    dispatch(signOut());
    localStorage.removeItem("Token");
    toast.success("You have been logged out");
  };

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <Drawer.Header title="MENU" titleIcon={() => <></>} />
      <Drawer.Items>
        <Sidebar className="[&>div]:bg-transparent [&>div]:p-0">
          <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-2">
              <Link to="/dashboard?tab=profile">
                <Sidebar.Item
                  active={tab === "profile"}
                  icon={BsPersonCircle}
                  label={currentUser.result.isAdmin ? "Admin" : "User"}
                  labelColor="dark"
                  className="cursor-pointer"
                  as="div"
                  onClick={handleClose}
                >
                  Profile
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=createpost">
                <Sidebar.Item
                  active={tab === "createpost"}
                  icon={BsPlusCircle}
                  className="cursor-pointer"
                  as="div"
                  onClick={handleClose}
                >
                  New Post
                </Sidebar.Item>
              </Link>
              {currentUser.result.isAdmin && (
                <Link to="/admindashboard?tab=allpost">
                  <Sidebar.Item
                    active={tab === "allpost"}
                    icon={BsPostcard}
                    className="cursor-pointer"
                    as="div"
                    onClick={handleClose}
                  >
                    All Post
                  </Sidebar.Item>
                </Link>
              )}
              {currentUser.result.isAdmin && (
                <Link to="/admindashboard?tab=alluser">
                  <Sidebar.Item
                    active={tab === "alluser"}
                    icon={BsPersonVcard}
                    className="cursor-pointer"
                    as="div"
                    onClick={handleClose}
                  >
                    All User
                  </Sidebar.Item>
                </Link>
              )}

              <Sidebar.Item
                icon={BsPower}
                className="cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </Drawer.Items>
    </Drawer>
  );
};

export default SideBar;
