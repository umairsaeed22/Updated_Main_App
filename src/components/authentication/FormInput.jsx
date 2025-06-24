import React from 'react';

const FormInput = ({
  value,
  label,
  onInputChange,
  placeholder,
  type,
  name,
}) => {
  return (
    <>
      <label className="text-sm text-primary-text">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onInputChange}
        placeholder={placeholder}
        className="w-full p-2 outline-0 bg-white border border-gray-200 text-sm text-primary-text placeholder:text-secondary-text rounded-md"
      />
    </>
  );
};

export default FormInput;
