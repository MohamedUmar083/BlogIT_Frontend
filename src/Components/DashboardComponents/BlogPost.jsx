import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const BlogPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/blogs");
  };

  // Function to handle upload a image for the blog using cloudinary
  const handleUploadImage = async () => {
    if (!file) {
      toast.error("Please Select a file to upload");
      return;
    }
    const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUDNAME;
    const timestamp = new Date().getTime();
    const filename = `${currentUser.result.email}/blog/${timestamp}`;
    const foldername = `${currentUser.result.email}/Blogs`;
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    if (file.size > maxSize) {
      setImageFileUploadProgress(null);
      setFile(null);

      toast.error("File size must be less than 2MB");

      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "BlogIT!");
      data.append("cloud_name", cloud_name);
      data.append("public_id", filename);
      data.append("folder", foldername);
      //data.append("overwrite", "true");

      await axios
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

          const fileUrl = response.data.url;
          //console.log(avatarUrl);
          setFormData({ ...formData, image: fileUrl });
          // toast.success("Image uploaded successfully");

          setTimeout(() => setImageFileUploadProgress(null), 1000); // Reset progress bar after upload
          //alert("Image Uploaded Successfully!");
        })
        .catch((error) => {
          console.error("Error uploading image:", error.message);

          setImageFileUploadProgress(null); // Reset progress bar after error

          toast.error("Error Uploading Image!");
        });
    }
  };

  // Function to handle the blog to post.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //to convert html to content
      //const strippedContent = formData.content.replace(/<[^>]+>/g, "");
      const response = await axios.post(
        `http://localhost:8383/api/post/create/${currentUser.result._id}`,
        formData,
        { headers: { token: localStorage.getItem("Token") } }
      );
      if (response.status !== 200) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        console.log(response.data);
        navigate("/blogs");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Enter the Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Science">Science</option>
            <option value="Education">Education</option>
            <option value="Lifestyle">Lifestyle</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                  styles={{
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
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something....."
          required
          className="h-72 mb-12"
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-5 pb-5">
          <Button
            gradientMonochrome="failure"
            className="sm:w-6/12"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            gradientMonochrome="success"
            className="sm:w-6/12"
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogPost;
