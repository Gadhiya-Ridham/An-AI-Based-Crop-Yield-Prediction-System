import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cardDetails from "../pages/prediction/inputPrediction.json";
import "./SearchResults.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get("query")?.toLowerCase() || "";
  const navigate = useNavigate();

  const filteredCards = cardDetails.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm) ||
      card.subtitle.toLowerCase().includes(searchTerm) ||
      card.id.toLowerCase().includes(searchTerm)
  );

  const highlightMatch = (text) => {
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const getPrediction = (id) => {
    navigate(`/Prediction/${id}`);
  };

  return (
    <div className="page-container">
      <div className="page-section">
        <div className="page-outerBox">
          <h2 style={{ textAlign: "center", marginTop: "40px" }}>
            Search Results for:{" "}
            <span className="highlight">"{searchTerm}"</span>
          </h2>

          {filteredCards.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "40px" }}>
              No results found.
            </p>
          ) : (
            <div className="page-innerSection">
              {filteredCards.map((item, index) => (
                <div key={index} className="box-container">
                  <div className="img-card-5">
                    <div className="img-scroll-5">
                      <img src={item.img} alt={item.title} />
                    </div>
                  </div>
                  <div className="desc-card-5">
                    <div className="card-title">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(item.title),
                        }}
                      />
                    </div>
                    <div className="card-subtitle">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(item.subtitle),
                        }}
                      />
                    </div>
                    <div
                      className="card-btn"
                      onClick={() => getPrediction(item.id)}
                    >
                      <span>Start Analysis</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
