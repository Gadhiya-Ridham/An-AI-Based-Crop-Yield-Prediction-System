import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "/src/components/pages/home/Home";
import About from "/src/components/pages/about/About";
import Prediction from "/src/components/pages/prediction/Prediction";
import CropYieldAi from "../components/pages/prediction/predictionOutput/CropYieldAI";
import FertilizerUse from "../components/pages/prediction/predictionOutput/FertilizerUse";
import IrrigationNeeded from "../components/pages/prediction/predictionOutput/IrrigationNeeded";
import WeatherImpact from "../components/pages/prediction/predictionOutput/WeatherImpact";
import Contact from "/src/components/pages/contact/Contact";
import ErrorFound from "/src/components/pages/ErrorFound/ErrorFound";
import SearchResults from "../components/header/searchResult";

function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to /Prediction */}
      <Route path="/" element={<Navigate to="/Prediction" />} />

      <Route path="/Home" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/Prediction" element={<Prediction />} />
      <Route path="/Prediction/CropYieldPrediction" element={<CropYieldAi />} />
      <Route
        path="/Prediction/FertilizerUsePrediction"
        element={<FertilizerUse />}
      />
      <Route
        path="/Prediction/IrrigationNeededPrediction"
        element={<IrrigationNeeded />}
      />
      <Route
        path="/Prediction/WeatherImpactPrediction"
        element={<WeatherImpact />}
      />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/404Found" element={<ErrorFound />} />
      <Route path="/search" element={<SearchResults />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default AppRoutes;
