import React from "react";

function Input({
    label,
    id,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    errorMessage,
    required = false
}){
    return (
        <div>
            {label && (
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        {label} {required && <span className="text-danger">*</span>}
                    </label>
                </div>
            )}
            <div className="mt-2">
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    className="block w-full rounded-md bg-white px-3 py-1.5 mb-4 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-warning sm:text-sm/6"
                />
            </div>
        </div>
    )
};

export default Input