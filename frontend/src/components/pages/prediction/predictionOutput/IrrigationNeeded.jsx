import React, { useState } from "react";
import "./inputs/predictionsOutput.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputDataUser from "./inputs/inputDataUser";

function IrrigationNeeded() {
  const [predictionOutput, setPredictionOutput] = useState(null);
  return (
    <>
      <ToastContainer position="bottom-right" className="custom_toast" />
      <div className="pd-container">
        <div className="pd-section">
          <div className="pd-outerBox">
            <span className="pd-title">
              AI-Driven Smart Irrigation Planning
            </span>
            <span className="pd-subtitle">
              Improve water efficiency, prevent over-irrigation, and enhance
              crop hydration using AI-powered irrigation strategies tailored to
              specific farming conditions and needs.
            </span>

            <InputDataUser setPredictionOutput={setPredictionOutput} />
            {predictionOutput && predictionOutput.fertilizer_use && (
              <div className="pd-outputBox">
                <div className="pd-output-section">
                  <div className="pd-line"></div>
                  <div className="pd-title-2">
                    <span>Irrigation Output</span>
                    <p>
                      Crop Water Requirement :{" "}
                      {predictionOutput.Irrigation_Output.CWR} mm/day
                    </p>
                    <p>
                      Rainfall : {predictionOutput.Irrigation_Output.Rainfall}{" "}
                      mm/day
                    </p>
                    <p>
                      Irrigation Required :{" "}
                      {predictionOutput.Irrigation_Output.Irrigation_Required}{" "}
                      mm/day
                    </p>

                    <p className="pd-recd">
                      Recommendation :{" "}
                      {predictionOutput.Irrigation_Output.Recommendation}
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

export default IrrigationNeeded;
