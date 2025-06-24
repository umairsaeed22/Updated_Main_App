import React, { useEffect, useState } from "react";
import Logo from '../assets/untitled@1x-1.0s-309px-211px.svg';

const LoadingScreen = () => {  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#153d64] z-50">
      <img
        src={Logo}
        alt="Logo"
        className={`transition-opacity duration-500`}
      />
    </div>
  );
};

export default LoadingScreen;
