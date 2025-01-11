import React, { useEffect, useState } from "react";
import { Avatar, Card } from "flowbite-react";
import DOMPurify from "dompurify";
import axios from "axios";

import { format } from "date-fns";
import toast from "react-hot-toast";
const Home = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8383/api/post/getallpost"
      );
      if (response.status === 200) {
        setBlogs(response.data);
        //toast.success("Fetched All Post");
        //console.log(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch all post");
      console.log(error);
    }
  };

  return (
    <div className="min-h-96">
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
        <>
          {" "}
          {blogs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((ele, index) => {
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
                  <Card className="h-full shadow-xl hover:shadow-gray-400 transition-shadow duration-300 border-gray-300 dark:shadow-lg dark:hover:shadow-gray-700">
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
        </>
      )}
    </div>
  );
};

export default Home;
