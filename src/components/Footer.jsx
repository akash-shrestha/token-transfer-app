import React from "react";

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-gray-300 text-sm text-center italic">
        "Be ready to experience the miracles"
      </p>
      <p className="text-gray-300 text-sm text-center font-medium mt-2">
        star@hotmail.com
      </p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-500 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-gray-300 text-left text-xs">@Star2022</p>
      <p className="text-gray-300 text-right text-xs">All rights reserved</p>
    </div>
  </div>
);

export default Footer;
