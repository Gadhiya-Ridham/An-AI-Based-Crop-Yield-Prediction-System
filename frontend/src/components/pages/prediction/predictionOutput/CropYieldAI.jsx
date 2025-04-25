import React, { useState } from "react";
import "./inputs/predictionsOutput.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputDataUser from "./inputs/inputDataUser";

function CropYieldAI() {
  const [predictionOutput, setPredictionOutput] = useState(null);
  return (
    <>
      <ToastContainer position="bottom-right" className="custom_toast" />
      <div className="pd-container">
        <div className="pd-section">
          <div className="pd-outerBox">
            <span className="pd-title">
              AI-powered crop yield prediction for smart farming
            </span>
            <span className="pd-subtitle">
              Leverage AI to analyze farming data, predict yields, enhance
              decision-making, boost productivity, and ensure sustainable
              agriculture with accurate insights.
            </span>

            <InputDataUser setPredictionOutput={setPredictionOutput} />

            {predictionOutput ? (
              <div className="pd-outputBox">
                <div className="pd-output-section">
                  <div className="pd-title-1">
                    <span>Crop Yield Predicted</span>
                    <p>{predictionOutput.predicted_yield}</p>
                  </div>
                  <div className="pd-line"></div>
                  <div className="pd-title-1">
                    <span>Confidence score</span>
                    <p>{predictionOutput.confidence_score}</p>
                  </div>
                  <div className="pd-line"></div>
                  <div className="pd-title-2">
                    <span>Fertilizer Use</span>
                    <p>DAP :  {predictionOutput.fertilizer_use.DAP}</p>
                    <p>MOP :  {predictionOutput.fertilizer_use.MOP}</p>
                    <p>UREA :  {predictionOutput.fertilizer_use.Urea}</p>
                    <p className="pd-recd">
                      Recommendation : {predictionOutput.fertilizer_use.Recommendation}
                    </p>
                  </div>
                  <div className="pd-line"></div>
                  <div className="pd-title-2">
                    <span>Irrigation Output</span>
                    <p>Crop Water Requirement : {predictionOutput.Irrigation_Output.CWR} mm/day</p>
                    <p>Rainfall : {predictionOutput.Irrigation_Output.Rainfall} mm/day</p>
                    <p>Irrigation Required : {predictionOutput.Irrigation_Output.Irrigation_Required} mm/day</p>

                    <p className="pd-recd">
                      Recommendation : {predictionOutput.Irrigation_Output.Recommendation}
                    </p>
                  </div>
                  <div className="pd-line"></div>
                  <div className="pd-title-2">
                    <span>Weather Impact</span>
                    <p className="pd-recd">
                      Weather conditions influence the crop yield by {predictionOutput.weather_impact} in
                      this prediction.
                    </p>
                  </div>
                  <div className="pd-line"></div>
                </div>
              </div>
            ) : (
              <h2>Waiting for Prediction...</h2>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CropYieldAI;
