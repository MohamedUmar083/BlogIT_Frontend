import axios from "axios";
import { format } from "date-fns";
import {
  Avatar,
  Button,
  Card,
  Modal,
  FileInput,
  Select,
  TextInput,
} from "flowbite-react";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Blogs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [blogs, setBlogs] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [formData, setFormData] = useState({});
  const [deleted, setDeleted] = useState([]);
  const [edited, setEdited] = useState([]);
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  // const [expandedIndex, setExpandedIndex] = useState(null); // Track which card is expanded

  // const handleToggle = (index) => {
  //   setExpandedIndex(expandedIndex === index ? null : index);
  // };

  useEffect(() => {
    fetchData();
  }, [deleted, edited]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://blogit-backend-yhnk.onrender.com/api/post/getmypost/${currentUser.result._id}`,
        { headers: { token: localStorage.getItem("Token") } }
      );

      setBlogs(response.data.result);
      //console.log(response.data.result);
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
      //console.log(error.response.data.message);
    }
  };
  const handleEditModal = (blog) => {
    setEditData(blog);
    //console.log(blog);
    setOpenEditModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error("No Changes Made");
      return;
    }
    try {
      const response = await axios.put(
        `https://blogit-backend-yhnk.onrender.com/api/post/updatepost/${editData._id}`,
        formData,
        { headers: { token: localStorage.getItem("Token") } }
      );

      if (response.status === 200) {
        setEdited(response.data);

        toast.success(response.data.message);
        setOpenEditModal(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || error.message);
    }
  };
  const handleUploadImage = async () => {
    const timestamp = new Date().getTime();
    const filename = `${currentUser.result.email}/${timestamp}`;
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
      data.append("cloud_name", "dhvo9y1ct");
      data.append("public_id", filename);
      //data.append("overwrite", "true");

      await axios
        .post("https://api.cloudinary.com/v1_1/dhvo9y1ct/image/upload", data, {
          onUploadProgress: (progressEvent) => {
            const percentComplete = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setImageFileUploadProgress(percentComplete); // Update progress
          },
        })
        .then((response) => {
          //console.log("Image uploaded successfully:", response.data);
          //setImageUrl(response.data.url);

          const fileUrl = response.data.url;
          //console.log(avatarUrl);
          setFormData({ ...formData, image: fileUrl });
          setEditData({ ...editData, image: fileUrl });
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
  const handleDelete = async (postID) => {
    setOpenModal(false);
    //console.log(postID);
    try {
      const response = await axios.delete(
        `https://blogit-backend-yhnk.onrender.com/api/post/deletepost/${postID}`,
        { headers: { token: localStorage.getItem("Token") } }
      );

      if (response.status === 200) {
        setDeleted(response.data);
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-96">
      <h2 className="pt-10 text-center sm:text-4xl text-xl font-bold text-gray-700 dark:text-gray-200">
        My Blogs
      </h2>
      {blogs.length === 0 ? (
        <div className="pt-20 text-center">
          <h2 className="sm:text-4xl text-xl font-bold text-gray-700 dark:text-gray-200">
            There are no posts to display.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please check back later or create a new post.
          </p>
        </div>
      ) : (
        <div className="my-10 flex flex-col sm:flex-row md:flex-row lg:flex-row flex-wrap justify-center">
          {blogs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((ele, index) => {
              const formattedDate = format(
                new Date(ele.createdAt),
                "MMMM dd, yyyy"
              );
              const sanitizedContent = DOMPurify.sanitize(ele.content);
              return (
                <div key={index} className="mx-5 my-5 sm:w-96 md:w-80 lg:w-96">
                  <Card className="h-full flex-1 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-gray-300">
                    {/* Header Section */}
                    <div className="flex items-center">
                      <Avatar img={ele.author.avatar || "BlogIT User"} rounded>
                        <div className="space-y-1 font-medium dark:text-white">
                          <div>{ele.author.username || "BlogIT User"}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formattedDate}
                          </div>
                        </div>
                      </Avatar>
                    </div>

                    {/* Image Section */}
                    <img
                      src={ele.image}
                      className="w-full h-full object-cover"
                    />

                    <div className="p-4 flex flex-col justify-between h-auto">
                      <div className="flex justify-between items-baseline">
                        {/* Body Section */}
                        <h3 className="text-l font-bold text-gray-900 dark:text-white">
                          {ele.title}
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {ele.category}
                        </span>
                      </div>
                      <div
                        className="mt-2 text-sm text-gray-700 dark:text-gray-400 flex-grow line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                      />
                      {/* <p
                   className={`mt-2 text-sm text-gray-700 dark:text-gray-400 flex-grow ${
                     expandedIndex === index ? "" : "line-clamp-3"
                   }`}
                 >
                  {ele.content}
                 </p> */}
                      {/* Read More Link */}
                      {/* {ele.content.length > 200 && (
                   <button
                     onClick={() => handleToggle(index)}
                     className="mt-2 text-blue-500 text-sm"
                   >
                     {expandedIndex === index ? "Read Less" : "Read More"}
                   </button>
                 )} */}
                    </div>
                    {/* Footer Section */}
                    <div className="flex justify-end items-center gap-2 p-4 border-t">
                      <Button
                        onClick={() => handleEditModal(ele)}
                        size="sm"
                        gradientMonochrome="teal"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => setOpenModal(ele._id)}
                        size="sm"
                        gradientMonochrome="failure"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                  {/* Modal for Edit Post */}

                  <Modal
                    show={openEditModal}
                    size="md"
                    onClose={() => setOpenEditModal(false)}
                  >
                    <Modal.Header>Edit Post</Modal.Header>
                    <Modal.Body>
                      <form
                        className="flex flex-col gap-5"
                        onSubmit={handleEdit}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row justify-between">
                          <TextInput
                            type="text"
                            placeholder="Enter the Title"
                            required
                            id="title"
                            className="flex-1"
                            defaultValue={editData.title}
                            onChange={handleChange}
                          />
                          <Select
                            id="category"
                            defaultValue={editData.category}
                            onChange={handleChange}
                          >
                            <option value="uncategorized">
                              Select Category
                            </option>
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
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-2 border-gray-500 p-3">
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
                            Upload Image
                          </Button>
                        </div>

                        {editData.image && (
                          <img
                            src={editData.image}
                            alt="upload"
                            className="w-full h-72 object-cover"
                          />
                        )}
                        <ReactQuill
                          theme="snow"
                          id="content"
                          placeholder="Write Something....."
                          required
                          className="h-72 mb-12"
                          defaultValue={editData.content}
                          onChange={(value) =>
                            setFormData({ ...formData, content: value })
                          }
                        />
                        <div className="flex justify-center gap-4 border-t mt-5">
                          <Button
                            gradientMonochrome="failure"
                            onClick={() => setOpenEditModal(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            gradientMonochrome="success"
                            disabled={imageFileUploadProgress}
                          >
                            Update
                          </Button>
                        </div>
                      </form>
                    </Modal.Body>
                  </Modal>

                  {/*  */}
                  {/*  */}
                  {/* Modal for Delete Post */}
                  <Modal
                    show={openModal === ele._id}
                    size="md"
                    onClose={() => setOpenModal(false)}
                    popup
                  >
                    <Modal.Header />
                    <Modal.Body>
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-black">
                          Are you sure you want to delete {ele.title} ?
                        </h3>
                        <div className="flex justify-center gap-4">
                          <Button
                            gradientMonochrome="failure"
                            onClick={() => handleDelete(ele._id)}
                          >
                            Yes, I'm sure
                          </Button>
                          <Button
                            gradientMonochrome="success"
                            onClick={() => setOpenModal(false)}
                          >
                            No, cancel
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Blogs;
