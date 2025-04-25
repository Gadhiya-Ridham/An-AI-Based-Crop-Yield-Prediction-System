import React, { useState } from "react";
import "./inputs/predictionsOutput.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputDataUser from "./inputs/inputDataUser";

function WeatherImpact() {
  const [predictionOutput, setPredictionOutput] = useState(null);
  return (
    <>
      <ToastContainer position="bottom-right" className="custom_toast" />
      <div className="pd-container">
        <div className="pd-section">
          <div className="pd-outerBox">
            <span className="pd-title">
              AI-Powered Weather Influence on Crops
            </span>
            <span className="pd-subtitle">
              Analyze temperature, rainfall, humidity, and climate patterns with
              AI to mitigate risks, optimize farming practices, and improve
              overall crop resilience.
            </span>

            <InputDataUser setPredictionOutput={setPredictionOutput} />
            {predictionOutput && predictionOutput.fertilizer_use && (
              <div className="pd-outputBox">
                <div className="pd-output-section">
                  <div className="pd-line"></div>
                  <div className="pd-title-2">
                    <span>Weather Impact</span>
                    <p className="pd-recd">
                      Weather conditions influence the crop yield by{" "}
                      {predictionOutput.weather_impact} in this prediction.
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

export default WeatherImpact;
