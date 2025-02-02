import axios from "axios";
import { Avatar, Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [deleted, setDeleted] = useState([]);

  useEffect(() => {
    fetchData();
  }, [deleted, users]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://blogit-backend-yhnk.onrender.com/api/admin/getalluser",
        { headers: { token: localStorage.getItem("Token") } }
      );
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleDelete = async (id) => {
    const userid = id;
    try {
      const response = await axios.delete(
        `https://blogit-backend-yhnk.onrender.com/api/admin/deleteuser/${userid}`,
        { headers: { token: localStorage.getItem("Token") } }
      );

      if (response.status === 200) {
        toast.success("User deleted successfully");
        setDeleted(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-96">
      <h2 className="text-center sm:text-4xl text-xl font-bold text-gray-700 dark:text-gray-200">
        Available Users
      </h2>
      {users.length === 0 ? (
        <div className="pt-20 text-center">
          <h2 className="sm:text-4xl text-xl font-bold text-gray-700 dark:text-gray-200">
            There are no users available right now
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please check back later.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pt-5 px-5 pb-20">
          <Table hoverable>
            <Table.Head className="text-center">
              <Table.HeadCell>S.NO</Table.HeadCell>
              <Table.HeadCell>Avatar</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y text-center">
              {users
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((ele, index) => {
                  return (
                    <Table.Row
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <Avatar alt={ele.username} img={ele.avatar} rounded />
                      </Table.Cell>
                      <Table.Cell>{ele.username}</Table.Cell>
                      <Table.Cell>{ele.email}</Table.Cell>
                      <Table.Cell>{ele.blogs.length}</Table.Cell>
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

export default AllUser;
