import axios from "axios";
import React from "react";
import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { app } from "../../firebase.js";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { signinFailure, signinSuccess } from "../../Redux/Slice/userSlice.jsx";

const Oauth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      };
      const response = await axios.post(
        "https://blogit-backend-yhnk.onrender.com/api/auth/google",
        userData
      );

      if (response.status === 200) {
        dispatch(signinSuccess(response.data));
        localStorage.setItem("Token", response.data.token);
        toast.success("Logged in successfully");

        navigate("/");
      }
    } catch (error) {
      dispatch(signinFailure(error.message));
      toast.error(error.message);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="purpleToBlue"
      outline
      onClick={handleSubmit}
    >
      <FcGoogle className="self-center w-5 h-5 mr-2" />
      Continue with Google
    </Button>
  );
};

export default Oauth;
