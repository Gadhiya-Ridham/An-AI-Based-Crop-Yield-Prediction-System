import React from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import cardDetails from "./inputPrediction.json";
// import axios from "axios";
import "./prediction.css";
// import { toast, ToastContainer } from "react-toastify";
import { ToastContainer } from "react-toastify";

function Prediction() {
  const navigate = useNavigate();

  const getPrediction = async (id) => {
    navigate(`/Prediction/${id}`);
    // try {
    //   const res = await axios.get("http://localhost:9090");
    //   if (res.status === 200) {
    //   } else {
    //     toast.error("❌ Server or database is not running");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   navigate(`/404Found`);
    //   // toast.error("Server is not Open ")
    // }
  };
  return (
    <>
      <ToastContainer position="bottom-right" className="custom_toast" />
      <div className="page-container">
        <div className="page-section">
          <div className="page-outerBox">
            <span className="page-title">
              AI-driven forecasts for smarter decisions
            </span>
            <span className="page-subtitle">
              Enhance efficiency with AI-driven analytics—unlock insights,
              automate tasks, and optimize decision-making.
            </span>
            <div className="page-innerSection">
              {cardDetails.map((item, index) => (
                <div key={index} className="box-container">
                  <div className="img-card-5">
                    <div className="img-scroll-5">
                      <img src={item.img} alt="" />
                    </div>
                  </div>
                  <div className="desc-card-5">
                    <div className="card-title">
                      <p>{item.title}</p>
                    </div>
                    <div className="card-subtitle">
                      <p>{item.subtitle}</p>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Prediction;
