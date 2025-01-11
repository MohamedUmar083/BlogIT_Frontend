import axios from "axios";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Oauth from "../../Components/Authentication/Oauth.jsx";
import {
  signin,
  signinFailure,
  signinSuccess,
} from "../../Redux/Slice/userSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.email) {
      dispatch(signinFailure("Please enter all required field"));

      toast.error("Please enter all required field");
      return;
    }

    try {
      dispatch(signin());
      const response = await axios.post(
        "http://localhost:8383/api/auth/login",
        formData
      );
      //console.log(response);
      if (response.data.success === false) {
        return dispatch(signinFailure(response.data.message));
      }

      if (response.status == 200) {
        dispatch(signinSuccess(response.data));

        toast.success(response.data.message);
        localStorage.setItem("Token", response.data.token);
        navigate("/");
      }
    } catch (error) {
      //console.log(error);
      dispatch(signinFailure(error.message));
      toast.error(error.response?.data.message || error.message);
      // console.log(error.message);
      // setErrorMsg(error.message);
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <div className="font-bold dark:text-white text-4xl">
            Blog{" "}
            <span className="px-2 py-1 bg-gradient-to-bl from-violet-800 to-blue-700 rounded text-white">
              IT!
            </span>
          </div>
          <p className="text-sm mt-6">
            You can sign in with your Email and password or you can use the
            Google.
          </p>
        </div>

        <div className="flex-1">
          {/* {error && toast.error(error)} */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Enter Your Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner color="info" size="sm" />
                  <span className="pl-3"> Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <hr />
            <Oauth />
          </form>

          <div className="flex gap-2 text-sm mt-6">
            <span>Don't Have An Account ?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
