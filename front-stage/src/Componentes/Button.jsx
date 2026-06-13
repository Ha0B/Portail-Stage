import React from 'react';

const Button = ({
    text,
    type = "primary",
    onClick,
    disabled = false
}) => {
    return (
        <button
            className={`btn btn-${type}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default Button;