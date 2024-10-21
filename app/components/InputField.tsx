import React from "react";

interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string | number;
  label: string;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
}

const InputField = ({
  id,
  name,
  type,
  value,
  label,
  autoComplete = "on",
  placeholder = "",
  disabled = false,
  onChange,
  onInput,
}: InputProps) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block px-1 pb-1 pt-2 text-sm 3xl:py-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onInput={onInput}
        className="input input-bordered h-10 w-full text-sm 3xl:h-12 3xl:text-base"
      />
    </div>
  );
};

export default InputField;
