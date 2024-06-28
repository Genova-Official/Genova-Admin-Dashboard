import { useState, forwardRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DatePickerIcon from "../icons/DatePickerIcon";

const InputComponent = forwardRef(
  (
    {
      type,
      placeholder,
      disabled,
      password,
      label,
      error,
      register,
      accept,
      date,
    },
    ref
  ) => {
    const [passwordType, setPasswordType] = useState(type);
    const passwordToggle = () => {
      if (passwordType === "text") {
        return (
          <FaEye
            className="text-gray-400 h-5 w-5 mx-2 cursor-pointer"
            onClick={() => setPasswordType("password")}
          />
        );
      } else if (passwordType === "password") {
        return (
          <FaEyeSlash
            className="text-gray-400 h-5 w-5 mx-2 cursor-pointer"
            onClick={() => setPasswordType("text")}
          />
        );
      } else return null;
    };

    return (
      <div className="grid gap-1">
        <p className="text-[#000] font-medium text-sm">{label}</p>
        <div className="grid gap-1">
          <div
            className={
              error
                ? "relative flex items-center bg-transparent border border-red-600 rounded-md text-[#010101] text-base w-full"
                : "relative flex items-center bg-transparent border border-[#A9A9A9] rounded-md text-[#010101] text-base w-full"
            }
          >
            {price && <span className="ml-3">&#8358;</span>}
            <input
              ref={ref}
              className="w-full py-3 px-3 outline-none border-none bg-inherit rounded-md no-number-arrows"
              type={passwordType}
              placeholder={placeholder}
              {...register}
              disabled={disabled}
              accept={accept}
            />
            {password && passwordToggle()}
            {date && (
              <div className="cursor-pointer">
                <DatePickerIcon />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

InputComponent.displayName = 'InputComponent'; 

export default InputComponent;
