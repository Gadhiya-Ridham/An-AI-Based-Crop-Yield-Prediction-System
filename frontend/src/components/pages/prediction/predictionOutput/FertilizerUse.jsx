import React, { useState } from "react";
import "./inputs/predictionsOutput.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputDataUser from "./inputs/inputDataUser";

function FertilizerUse() {
  const [predictionOutput, setPredictionOutput] = useState(null);
  return (
    <>
      <ToastContainer position="bottom-right" className="custom_toast" />
      <div className="pd-container">
        <div className="pd-section">
          <div className="pd-outerBox">
            <span className="pd-title">
              Smart AI-Based Fertilizer Recommendations
            </span>
            <span className="pd-subtitle">
              Optimize soil health and maximize crop yield with AI-driven
              fertilizer recommendations, ensuring balanced nutrient application
              and efficient resource utilization.
            </span>

            <InputDataUser setPredictionOutput={setPredictionOutput} />
            {predictionOutput && predictionOutput.fertilizer_use && (
              <div className="pd-outputBox">
                <div className="pd-output-section">
                  <div className="pd-line"></div>
                  <div className="pd-title-2">
                    <span>Fertilizer Use</span>
                    <p>DAP : {predictionOutput.fertilizer_use.DAP}</p>
                    <p>MOP : {predictionOutput.fertilizer_use.MOP}</p>
                    <p>UREA : {predictionOutput.fertilizer_use.Urea}</p>
                    <p className="pd-recd">
                      Recommendation :{" "}
                      {predictionOutput.fertilizer_use.Recommendation}
                    </p>
                  </div>
                  <div className="pd-line"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FertilizerUse;
