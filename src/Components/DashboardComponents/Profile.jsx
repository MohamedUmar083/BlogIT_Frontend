import axios from "axios";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOut,
  update,
  updateFailure,
  updateSuccess,
} from "../../Redux/Slice/userSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const filePickerRef = useRef();

  const handleImage = (e) => {
    const image = e.target.files[0];
    if (image) {
      setAvatar(image);

      setImageUrl(URL.createObjectURL(image));
    }
  };

  useEffect(() => {
    if (avatar) {
      uploadImage();
    }
  }, [avatar]);

  const uploadImage = async () => {
    setImageFileUploading(true);

    const timestamp = new Date().getTime();
    const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUDNAME;
    const filename = `${currentUser.result.email}/profile/${timestamp}`;
    const foldername = `${currentUser.result.email}/Profile_Pictures`;
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    if (avatar.size > maxSize) {
      setImageUrl(null);
      setImageFileUploadProgress(null);
      setAvatar(null);
      setImageFileUploading(false);

      toast.error("File size must be less than 2MB");

      return;
    }

    if (avatar.type === "image/jpeg" || avatar.type === "image/png") {
      setImageFileUploading(true);
      setImageFileUploadError(null);

      const data = new FormData();
      data.append("file", avatar);
      data.append("upload_preset", "BlogIT!");
      data.append("cloud_name", cloud_name);
      data.append("public_id", filename);
      data.append("folder", foldername);
      //data.append("overwrite", "true");

      axios
        .post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          data,
          {
            onUploadProgress: (progressEvent) => {
              const percentComplete = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setImageFileUploadProgress(percentComplete); // Update progress
            },
          }
        )
        .then((response) => {
          //console.log("Image uploaded successfully:", response.data);
          //setImageUrl(response.data.url);

          const avatarUrl = response.data.url;
          //console.log(avatarUrl);
          setFormData({ ...formData, avatar: avatarUrl });
          // toast.success("Image uploaded successfully");
          setImageFileUploading(false);
          setTimeout(() => setImageFileUploadProgress(null), 1000); // Reset progress bar after upload
          //alert("Image Uploaded Successfully!");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          setImageFileUploading(false);
          setImageFileUploadProgress(null); // Reset progress bar after error

          toast.error("Error Uploading Image!");

          setImageUrl(null);
        });
    } else {
      //console.log("Please Select a Valid Image!");
      toast.error("Please Select a Valid Image!");

      setImageFileUploading(false);
      setImageUrl(null);
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
    localStorage.removeItem("Token");
    toast.success("You have been logged out");
  };

  const handleDelete = async () => {
    dispatch(deleteStart());
    try {
      const response = await axios.delete(
        `https://blogit-backend-yhnk.onrender.com/api/user/delete/${currentUser.result._id}`,
        { headers: { token: localStorage.getItem("Token") } }
      );
      if (response.status === 200) {
        dispatch(deleteSuccess());
        toast.success(response.data.message);

        navigate("/signup");
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
      console.log(error);
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error("No Changes Made");
      return;
    }
    if (imageFileUploading) {
      toast.error("Please wait while the image is uploading");
      return;
    }
    try {
      dispatch(update());
      const response = await axios.put(
        `https://blogit-backend-yhnk.onrender.com/api/user/update/${currentUser.result._id}`,
        formData,
        { headers: { token: localStorage.getItem("Token") } }
      );

      if (response.status === 200) {
        // console.log(response.data);
        dispatch(updateSuccess(response.data));
        toast.success(response.data.message);
        setTimeout(() => navigate("/"), 2000);
        setFormData({});
      }
    } catch (error) {
      console.log(error);
      dispatch(updateFailure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 w-full">
      <h1 className="my-7 text-center font-semibold text-4xl">Profile</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImage}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress}
              text={`${imageFileUploadProgress}%`}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke:
                    imageFileUploadProgress === 100 ? "#52b788" : "#023e8a", // Color of the progress path
                },
                text: {
                  fill: "#52b788", // Text color
                  fontSize: "16px",
                },
                trail: {
                  stroke: "#f0f0f0", // Lighter gray color for the trail
                },
              }}
            />
          )}
          <img
            src={imageUrl || currentUser.result.avatar}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-5 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>

        <TextInput
          type="text"
          id="username"
          placeholder="UserName"
          defaultValue={currentUser.result.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.result.email}
          onChange={handleChange}
          readOnly={true}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="********"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientMonochrome="success"
          disabled={loading || imageFileUploading}
        >
          Update
        </Button>
      </form>
      <div className="text-red-600 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setOpenModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>

      {/* Modals  */}

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-black">
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="success" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
