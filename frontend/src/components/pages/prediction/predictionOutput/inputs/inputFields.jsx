import React, { useRef, useEffect, useState } from "react";

function InputFields({
  fieldName,
  name,
  type,
  value,
  onChange,
  required,
  hint,
  options,
  error,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (option) => {
    onChange(option);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    onChange(value);

    if (type === "dropdown") {
      const filtered = options.filter((option) =>
        option.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsDropdownOpen(filtered.length > 0);
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (event) => {
    if (type !== "dropdown" || filteredOptions.length === 0) return;

    if (event.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (event.key === "ArrowUp") {
      setHighlightedIndex((prev) =>
        prev === 0 ? filteredOptions.length - 1 : prev - 1
      );
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      handleSelectOption(filteredOptions[highlightedIndex]);
    }
  };

  return (
    <div className="pd-input-box" ref={dropdownRef}>
      <label htmlFor={name} className="pd-fieldName">
        {fieldName} {required && <span className="pd-needed">*</span>}
      </label>

      {type === "dropdown" ? (
        <div
          className={`pd-dropdown ${isDropdownOpen ? "active" : ""}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <input
            type="text"
            id={name}
            name={name}
            className={`pd-inputField pd-list ${error ? "error-border" : ""}`}
            value={value}
            placeholder={`Select or enter ${fieldName.toLowerCase()}...`}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {isDropdownOpen && (
            <div className="pd-option">
              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  className={highlightedIndex === index ? "highlighted" : ""}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          className={`pd-inputField ${error ? "error-border" : ""}`}
          value={value}
          placeholder={`Enter ${fieldName.toLowerCase()}...`}
          onChange={handleInputChange}
        />
      )}

      <span className="pd-hintSection">
        {error ? "Required field" : hint}
      </span>
    </div>
  );
}

export default InputFields;
