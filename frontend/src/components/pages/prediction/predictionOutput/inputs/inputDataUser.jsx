import React, { useEffect, useState } from "react";
import InputFields from "./inputFields";
import { inputFields } from "./options";
import {
  getSowingHarvestingMonth,
  getSoilType,
  calculatePH,
  calculateSolarRadiation,
  calculateEvapotranspiration,
  calculateSoilMoisture,
  calculateWindSpeed,
} from "./calculation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./predictionsOutput.css";

function InputDataUser({ setPredictionOutput }) {
  // function InputDataUser() {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    Year: currentYear,
    State: "",
    Crop: "",
    N_Soil: "",
    P_Soil: "",
    K_Soil: "",
    Temperature: "",
    Humidity: "",
    Rainfall: "",
    Area: "",
    Sowing_Month: "",
    Harvesting_Month: "",
    Season: "",
    Soil_Type: "",
    pH: "",
    Wind_Speed: "",
    Solar_Radiation: "",
    Evapotranspiration: "",
    Soil_Moisture: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateFields = () => {
    const newErrors = {};
    const requireFields = [
      "State",
      "Crop",
      "N_Soil",
      "P_Soil",
      "K_Soil",
      "Temperature",
      "Humidity",
      "Rainfall",
      "Area",
    ];

    requireFields.forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = `${key} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Auto-fill sowing/harvesting/season/soilType when crop is selected
  const { Crop, N_Soil, P_Soil, K_Soil, Rainfall, Temperature, Humidity } =
    formData;

  useEffect(() => {
    if (Crop.trim()) {
      const { sowingMonth, harvestingMonth, season } =
        getSowingHarvestingMonth(Crop);
      const Soil_Type = getSoilType(Crop);
      const pH = calculatePH(
        Number(N_Soil),
        Number(P_Soil),
        Number(K_Soil),
        Number(Rainfall)
      );
      const Wind_Speed = calculateWindSpeed(
        Number(Temperature),
        Number(Humidity)
      );
      const Solar_Radiation = calculateSolarRadiation(
        Number(Temperature),
        Number(Humidity)
      );
      const Evapotranspiration = calculateEvapotranspiration(
        Number(Temperature),
        Number(Wind_Speed),
        Number(Humidity),
        Number(Solar_Radiation)
      );
      const Soil_Moisture = calculateSoilMoisture(
        Number(Rainfall),
        Number(Evapotranspiration)
      );

      setFormData((prev) => ({
        ...prev,
        Sowing_Month: sowingMonth,
        Harvesting_Month: harvestingMonth,
        Season: season,
        Soil_Type,
        pH,
        Wind_Speed,
        Solar_Radiation,
        Evapotranspiration,
        Soil_Moisture,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        Sowing_Month: "",
        Harvesting_Month: "",
        Season: "",
        Soil_Type: "",
        pH: "",
        Wind_Speed: "",
        Solar_Radiation: "",
        Evapotranspiration: "",
        Soil_Moisture: "",
      }));
    }
  }, [Crop, N_Soil, P_Soil, K_Soil, Rainfall, Temperature, Humidity]);

  const handlePredict = async () => {
    if (validateFields()) {
      setLoading(true);

      try {
        // 🔹 Step 1: Call Flask Prediction API
        const response = await axios.post(
          "http://localhost:9090/userInputs",
          formData
        );
        const output = response.data;
        setPredictionOutput(output);
        // 🔹 Save input & output to localStorage
        localStorage.setItem("userInputData", JSON.stringify(formData));
        localStorage.setItem("predictionOutput", JSON.stringify(output));

        console.log("✅ Prediction from Flask:", output);
        toast.success("Data Send Successfull..")

        // 🔹 Step 2: Send input+output to Node.js → MongoDB
        const dbSaveResponse = await axios.post(
          "http://localhost:5000/savePrediction",
          {
            input: formData,
            output: output,
          }
        );
        console.log("✅ Data saved to MongoDB:", dbSaveResponse.data);
        toast.success("prediction & Data store to databse succesfull..");
      } catch (error) {
        console.error("❌ Error occurred:", error);

        let errorMessage = "Something went wrong while predicting.";

        const message = error?.message || "";
        const isNetworkError =
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNREFUSED" ||
          (typeof message === "string" &&
            message.toLowerCase().includes("network"));

        if (isNetworkError) {
          errorMessage =
            "Flask server is not reachable at http://localhost:9090. Please make sure the API is running.";
        }
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* <ToastContainer position="bottom-right" className="custom_toast" /> */}
      <div className="pd-inputfields-section">
        {inputFields.map(({ fieldName, name, type, options, hint }) => (
          <InputFields
            key={name}
            fieldName={fieldName}
            name={name}
            type={type}
            value={formData[name] || ""}
            onChange={(value) => handleChange(name, value)}
            options={options}
            hint={hint}
            required
            error={errors[name]}
          />
        ))}
        <div className="pd-predict-btn">
          <div className="pd-btn" onClick={handlePredict}>
            {loading ? "Predicting..." : "Predict"}
          </div>
        </div>
      </div>
    </>
  );
}

export default InputDataUser;
