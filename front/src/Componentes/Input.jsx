import React from 'react';

const Input = ({
    type = "text",
    placeholder,
    value,
    onChange,
    name,
    label
}) => {
    return (
        <div className="mb-3">
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}
            <input
                type={type}
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
            />
        </div>
    );
};

export default Input;