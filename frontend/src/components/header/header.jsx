import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, X } from "react-bootstrap-icons";
import cardDetails from "../pages/prediction/inputPrediction.json";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const allKeywords = cardDetails.flatMap((card) =>
    [card.title, card.subtitle].join(" ").toLowerCase().split(" ")
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim()) {
      const matched = Array.from(
        new Set(
          allKeywords.filter((word) => word.startsWith(value.toLowerCase()))
        )
      ).slice(0, 5);
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  const toggleSearch = () => {
    if (isExpanded) {
      setSearchText("");
      setSuggestions([]);
      navigate("/");
    }
    setIsExpanded(!isExpanded);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchText.trim())}`);
      setSuggestions([]);
    } else if (e.key === "Escape") {
      setIsExpanded(false);
      setSearchText("");
      setSuggestions([]);
    }
  };

  return (
    <div className="hd_container">
      <div className="hd_left_section">
        <ul>
          <li className="menuBox">
            <NavLink
              end
              className={({ isActive }) =>
                isActive ? "menuLinks active" : "menuLinks"
              }
              to="/Prediction"
            >
              Prediction
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="hd_logo_section">
        <div className="logo">Crop Analisi</div>
      </div>

      <div className="hd_right_section">
        <div className={`search-container ${isExpanded ? "search-expanded" : "search-collapsed"}`}>
          {!isExpanded && (
            <button className="icon-btn" onClick={toggleSearch}>
              <Search className="icon" />
            </button>
          )}

          {isExpanded && (
            <>
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchText}
                onChange={handleChange}
                onKeyDown={handleSearch}
                autoFocus
              />
              {suggestions.length > 0 && (
                <ul className="suggestion-box">
                  {suggestions.map((sugg, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSearchText(sugg);
                        navigate(`/search?query=${encodeURIComponent(sugg)}`);
                        setSuggestions([]);
                      }}
                    >
                      {sugg}
                    </li>
                  ))}
                </ul>
              )}
              {/* X Icon to close search */}
              <button className="icon-btn" onClick={toggleSearch}>
                <X className="icon" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
