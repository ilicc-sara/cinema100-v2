type InputProps = {
  type: string;
  placeholder: string;
  value: any;
  handleOnChange: (e: any) => void;
  name?: string;
};

function Input({ type, placeholder, value, handleOnChange, name }: InputProps) {
  return (
    <input
      className="bg-[#e8f0fe] w-full rounded h-11 !pl-3"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleOnChange}
    />
  );
}

export default Input;
