import axios from "axios";
import { Avatar, Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AllPost = () => {
  const [blogs, setBlogs] = useState([]);
  const [deleted, setDeleted] = useState([]);
  useEffect(() => {
    fetchData();
  }, [deleted, blogs]);

  const fetchData = async () => {
    try {
      const response = await axios(
        "http://localhost:8383/api/admin/getallpost",
        { headers: { token: localStorage.getItem("Token") } }
      );
      if (response.status === 200) {
        setBlogs(response.data.result);
        //console.log(blogs);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    const postid = id;
    try {
      const response = await axios.delete(
        `http://localhost:8383/api/admin/deletepost/${postid}`,
        { headers: { token: localStorage.getItem("Token") } }
      );
      if (response.status === 200) {
        setDeleted(response.data);
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || error.message);
    }
  };

  return (
    <div className="min-h-96">
      <h2 className="text-center sm:text-4xl text-xl font-bold text-gray-700 dark:text-gray-200">
        Available Posts
      </h2>
      {blogs.length === 0 ? (
        <div className="pt-20 text-center">
          <h2 className="sm:text-4xl text-xl font-bold text-gray-700 dark:text-gray-200">
            There are no blogs available right now
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please check back later.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pt-5 px-5 pb-20">
          {/* {console.log(blogs)} */}
          <Table hoverable>
            <Table.Head className="text-center">
              <Table.HeadCell>S.NO</Table.HeadCell>
              <Table.HeadCell>Blog</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y text-center">
              {blogs
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((ele, index) => {
                  return (
                    <Table.Row
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <Avatar alt="user_post" img={ele.image} size="xl" />
                      </Table.Cell>
                      <Table.Cell>{ele.title}</Table.Cell>
                      <Table.Cell>
                        {ele.author?.username
                          ? ele.author.username
                          : "BlogIT User"}
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex items-center justify-center ">
                          <Button
                            gradientMonochrome="failure"
                            size="sm"
                            onClick={() => handleDelete(ele._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AllPost;
