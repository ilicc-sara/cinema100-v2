type ButtonProps = {
  children: any;
  variation: string;
  handleClick?: () => void;
};

function Button({ children, variation, handleClick }: ButtonProps) {
  if (variation === "auth-button") {
    return (
      <button className="bg-[#fc4747] w-full rounded h-9 text-[#e8f0fe]">
        {children}
      </button>
    );
  }
  if (variation === "arr-button" && handleClick) {
    return (
      <button
        className="bg-[#ccc] tablet:w-10 tablet:h-10 max-tablet:w-7 max-tablet:h-7 rounded-full text-center cursor-pointer hover:scale-[1.1] transition duration-300  flex items-center justify-center"
        onClick={() => handleClick()}
      >
        {children}
      </button>
    );
  }
}

export default Button;
