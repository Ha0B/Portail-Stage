import React from 'react';

const SearchBar = ({
    placeholder = "Rechercher...",
    value,
    onChange
}) => {

    return (
        <div className="w-100">
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchBar;