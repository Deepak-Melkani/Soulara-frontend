import { useRouter } from "next/navigation";
import React from "react";

const Logo = () => {
  const router = useRouter();

  return (
    <div
      className={` flex items-center space-x-1 cursor-pointer`}
      onClick={() => router.push("/")}
    >
      {/* Main Logo Text */}
      <div className="flex items-baseline ">
        <span className="font-marcellus text-2xl md:text-3xl lg:text-4xl font-bold text-primary-700 tracking-wide">
          Soul
        </span>
        <span className="font-marcellus text-2xl md:text-3xl lg:text-4xl font-bold text-primary-500 tracking-wide">
          ara
        </span>
      </div>
    </div>
  );
};

export default Logo;
