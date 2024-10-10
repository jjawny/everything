"use client";

import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";

const UnderConstructionHeader: React.FC = () => {
  const [isHover, setIsHover] = useState<boolean>();

  return (
    <header
      className={`z-50 fixed select-none top-0 left-0 font-sedgwick w-screen transition-all ease-in-out duration-200 flex flex-col items-center
    ${isHover ? "opacity-80" : "opacity-40"}`}
    >
      <div className="bg-amber-300 bg-under-construction w-full h-1"></div>
      <div
        className="bg-amber-300 bg-under-construction pr-3 rounded-b-md pb-1 px-2 w-fit text-xs hover:scale-x-105 transition-all ease-in-out duration-100 border-b-[1px] border-x-[1px] border-amber-200 text-amber-900"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <InfoIcon fontSize="small" color="disabled" className="mr-1" /> this is a sandbox!!!
      </div>
    </header>
  );
};

export default UnderConstructionHeader;
