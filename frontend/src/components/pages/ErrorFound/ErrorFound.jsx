import React from "react";
import "./NotFound.css";

function ErrorFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">
        Oops! The server is currently unavailable.
      </p>
      <a href="/" className="notfound-home">
        Go to Home
      </a>
    </div>
  );
}

export default ErrorFound;
