import { Card } from "flowbite-react";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const CardSkeleton = () => {
  return (
    <div className="mx-auto my-10 sm:w-full sm:h-auto md:w-6/12 md:h-auto lg:w-6/12 lg:h-auto">
      <Card className="h-full shadow-xl hover:shadow-gray-400 transition-shadow duration-300 border-gray-300 dark:shadow-lg dark:hover:shadow-gray-700">
        {/* Header Section */}
        <div className="flex">
          <div className="mr-3">
            <Skeleton circle width={40} height={40} />
          </div>
          <div className="flex-1">
            <Skeleton count={2} />
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-60 mb-4 flex justify-center items-center bg-gray-300 animate-pulse">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>

        {/* Body Section */}
        <div className="p-4 flex flex-col justify-between h-1/2">
          <Skeleton count={3} style={{ marginBottom: ".5rem" }} />
        </div>
      </Card>
    </div>
  );
};

export default CardSkeleton;
