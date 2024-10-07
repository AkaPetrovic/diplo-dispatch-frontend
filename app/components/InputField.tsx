import React from "react";

interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string | number;
  label: string;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
}

const InputField = ({
  id,
  name,
  type,
  value,
  label,
  autoComplete = "on",
  onChange,
  onInput,
}: InputProps) => {
  return (
    <div className="w-full max-w-xs">
      <label htmlFor={id} className="block px-1 py-2 text-sm">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        onInput={onInput}
        className="input input-bordered w-full"
      />
    </div>
  );
};

export default InputField;
