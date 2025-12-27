import React from "react";
import IconCloudDemo from "./Icon";


const Languages = () => {
  return (
    <div>
      <div className="container md:min-h-[80vh] xl:min-h-[110vh] mx-auto pb-44 md:pb-10 xl:pb-44">
        <div className="flex flex-col justify-center bg-[#040407] items-center">
          <h2
            className={`text-lg text-white flex justify-center items-center pt-24 font-roboto font-light`}
          >
            {" "}
            EXPLORE MY
          </h2>
          <h3
            className={`text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-white flex relative text-center justify-center pt-3  items-center font-bold font-roboto `}
          >
            LANGUAGES AND TOOLS PROFICIENCY
          </h3>
        </div>
        <div className="flex flex-col pt-20  xl:flex-row bg-[#040407] justify-center items-center">
          <IconCloudDemo />

        </div>
      </div>
    </div>
  );
};

export default Languages;
