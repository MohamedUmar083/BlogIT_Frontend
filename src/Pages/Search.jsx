import axios from "axios";
import { Button, Navbar, Avatar, Card, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import toast from "react-hot-toast";
import CardSkeleton from "../Components/CardSkeleton";

const Search = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, [search]);

  const handleSearch = async (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      // If the input is empty, clear the blogs
      setBlogs([]);
      setSearch(true);

      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `https://blogit-backend-yhnk.onrender.com/api/post/searchpost?search=${value}`
      );
      if (response.status === 200) {
        setBlogs(response.data);
        setLoading(false);
        //console.log(response.data);
        setSearch(true);
      }
      if (response.data.length === 0) {
        setBlogs([]);
        setSearch(false);
        setLoading(false);
      }
    } catch (error) {
      setBlogs([]);
      setSearch(false);
      setLoading(false);
      toast.error(error.response?.data.message || error.message);
    }
  };
  return (
    <div className="min-h-96">
      <Navbar className="w-full flex justify-center pt-5">
        <div className="flex justify-center w-full">
          <div className="flex items-center">
            <TextInput
              type="text"
              placeholder="Search Blogs here....."
              rightIcon={FiSearch}
              className="w-52"
              onChange={handleSearch}
            />
          </div>
        </div>
      </Navbar>
      {loading ? (
        <CardSkeleton />
      ) : blogs.length === 0 ? (
        <div className="pt-20 text-center">
          <h2 className="sm:text-4xl text-xl font-bold text-gray-700 dark:text-gray-200">
            {search
              ? "Search Title or Category of the Blog to display."
              : "No Result Found"}
          </h2>
        </div>
      ) : (
        <div>
          {blogs.map((ele, index) => {
            const formattedDate = format(
              new Date(ele.createdAt),
              "MMMM dd, yyyy"
            );
            const sanitizedContent = DOMPurify.sanitize(ele.content);
            return (
              <div
                key={index}
                className="mx-auto my-10 sm:w-full sm:h-auto md:w-6/12 md:h-auto lg:w-6/12 lg:h-auto"
              >
                <Card className="h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 border-gray-300">
                  {/* Header Section */}
                  <div className="flex items-center p-4">
                    <Avatar
                      img={
                        ele.author?.avatar ||
                        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      }
                      rounded
                    >
                      <div className="font-medium dark:text-white">
                        <div>
                          {ele.author?.username ? (
                            ele.author.username
                          ) : (
                            <div className=" text-gray-500 dark:text-gray-300">
                              BlogIT User
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formattedDate}
                        </div>
                      </div>
                    </Avatar>
                  </div>

                  {/* Image Section */}
                  <img
                    src={ele.image}
                    alt="Blog Image"
                    className="w-full h-full object-cover"
                  />

                  {/* Body Section */}
                  <div className="p-4 flex flex-col justify-between h-1/2">
                    <div className="flex justify-between items-baseline">
                      <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                        {ele.title}
                      </h5>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {ele.category}
                      </span>
                    </div>
                    {/* <p className="mt-2 text-sm text-gray-700 dark:text-gray-400 flex-grow">
                  {ele.content}
                </p> */}
                    <div
                      className="mt-2 text-sm text-gray-700 dark:text-gray-400 flex-grow"
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
