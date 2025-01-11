import axios from "axios";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Oauth from "../../Components/Authentication/Oauth.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      return toast.error("Please enter required field");
    }

    try {
      setLoading(true);

      await axios
        .post("http://localhost:8383/api/auth/register", formData)
        .then((res) => {
          if (res.data.success === false) {
            return toast.error(res.data.message);
          }
          if (res.status === 200) {
            toast.success(res.data.message);
            navigate("/signin");
          }
        })
        .catch((error) => {
          toast.error(error.response?.data.message || error.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || error.message);

      setLoading(false);
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
            You can sign up with your Email and password or you can use the
            Google.
          </p>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Enter your User Name"
                id="username"
                onChange={handleChange}
              />
            </div>
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
                "Sign Up"
              )}
            </Button>
            <hr />
            <Oauth />
          </form>
          <div className="flex gap-2 text-sm mt-6">
            <span>Already Have An Account ?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
