import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import React, { useState } from "react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toggleTheme } from "../Redux/Slice/themeSlice";
import { signOut } from "../Redux/Slice/userSlice";
// import ProfileModals from "./Modals/ProfileModals";

const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);

  const handleSignOut = () => {
    dispatch(signOut());
    localStorage.removeItem("Token");
    toast.success("You have been logged out");
  };

  return (
    <div>
      <Navbar className=" border-b-2">
        <Link
          to="/"
          className="self-center whitespace-nowrap font-semibold text-xl"
        >
          Blog{" "}
          <span className="px-2 py-1 bg-gradient-to-bl from-violet-800 to-blue-700 rounded text-white">
            IT!
          </span>
        </Link>

        <div className="flex gap-2 md:order-2">
          <Button
            gradientDuoTone="purpleToBlue"
            size="lg"
            className="rounded-full w-10 h-10 flex items-center justify-center focus:ring-2 focus:ring-blue-400"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <BsFillMoonFill /> : <BsFillSunFill />}
          </Button>
          {currentUser ? (
            <Dropdown
              label={
                <Avatar
                  alt={currentUser.result.username}
                  img={currentUser.result.avatar}
                  rounded
                />
              }
              arrowIcon={false}
              inline
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {currentUser.result.username}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <Link to="/dashboard?tab=profile">My Profile</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link to="/dashboard?tab=createpost">New Post</Link>
              </Dropdown.Item>
              {/* <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Earnings</Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/signin " className="self-center">
              <Button
                gradientDuoTone="purpleToBlue"
                className="focus:ring-2 focus:ring-blue-400"
              >
                Sign In
              </Button>
            </Link>
          )}

          <Navbar.Toggle />
        </div>
        {/* <ProfileModals openModal={openModal} setOpenModal={handleClose} /> */}
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          {currentUser && (
            <Navbar.Link active={path === "/blogs"} as={"div"}>
              <Link to="/blogs">Blogs</Link>
            </Navbar.Link>
          )}

          <Navbar.Link active={path === "/search"} as={"div"}>
            <Link to="/search">Search</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
