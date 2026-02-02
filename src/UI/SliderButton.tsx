import React from "react";

type SliderButtonType = {
  index: number;
  activeSlide: number;
  handleClick: () => void;
};

function SliderButton({ index, activeSlide, handleClick }: SliderButtonType) {
  return (
    <button
      key={index}
      onClick={() => handleClick()}
      className={`bg-[#ccc] tablet:w-10 tablet:h-10 max-tablet:w-7 max-tablet:h-7 rounded-full cursor-pointer hover:scale-[1.1] transition duration-300 ${
        activeSlide === index + 1 ? "bg-[#fc4747]" : ""
      }`}
    >
      {index + 1}
    </button>
  );
}

export default SliderButton;
