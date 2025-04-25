import os
import time
import traceback
import joblib
import json
import logging
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from scipy.sparse import csr_matrix
from pymongo import MongoClient
from flask_cors import CORS
import traceback

# ✅ Initialize Flask App
app = Flask(__name__)
CORS(app) 

# ✅ File paths
MODEL_PATH = "Project/Output_Folder/models/xgboost_model.pkl"
PREPROCESSOR_PATH = "Project/Output_Folder/models/preprocessor.pkl"
METRICS_PATH = "Project/Output_Folder/models/metrics.json"

# ✅ Check if necessary files exist
for path in [MODEL_PATH, PREPROCESSOR_PATH, METRICS_PATH]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"❌ Missing file: {path}. Please train the model first.")

# ✅ Load Model & Preprocessor
try:
    model = joblib.load(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
except Exception as e:
    raise RuntimeError(f"❌ Error loading model or preprocessor: {e}")

# ✅ Load R² Score from Metrics File
try:
    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)
        r2_confidence = metrics.get("r2_score", 0)
        confidence_score = f"{round(r2_confidence * 100, 2)}%"
except Exception as e:
    logging.warning(f"⚠️ Error reading metrics file: {e}")
    confidence_score = "98%"  # Default value

# ✅ Define Required Fields
REQUIRED_FIELDS = [
    "Crop", "N_Soil", "P_Soil", "K_Soil", "Temperature", "Rainfall", "pH", 
    "Soil_Moisture", "Evapotranspiration", "Solar_Radiation", "Soil_Type"
]

@app.route('/userInputs', methods=['POST'])
def predict():
    try:
        # ✅ Get JSON Data
        data = request.get_json()
        print("📥 Received Input:", data)

        # 🔧 Convert string inputs to proper numeric types where necessary
        data["Year"] = int(data["Year"])
        data["N_Soil"] = float(data["N_Soil"])
        data["P_Soil"] = float(data["P_Soil"])
        data["K_Soil"] = float(data["K_Soil"])
        data["Temperature"] = float(data["Temperature"])
        data["Humidity"] = float(data["Humidity"])
        data["Rainfall"] = float(data["Rainfall"])
        data["Area"] = float(data["Area"])
        data["pH"] = float(data["pH"])
        data["Wind_Speed"] = float(data["Wind_Speed"])
        data["Solar_Radiation"] = float(data["Solar_Radiation"])
        data["Evapotranspiration"] = float(data["Evapotranspiration"])
        data["Soil_Moisture"] = float(data["Soil_Moisture"])
        # The rest are categorical and can remain as strings
        data["State"] = str(data["State"])
        data["Crop"] = str(data["Crop"])
        data["Sowing_Month"] = str(data["Sowing_Month"])
        data["Harvesting_Month"] = str(data["Harvesting_Month"])
        data["Season"] = str(data["Season"])
        data["Soil_Type"] = str(data["Soil_Type"])

        
        if not data:
            logging.error("❌ No data received")
            return jsonify({"error": "No data received"}), 400

        # ✅ Validate Input Fields
        missing_fields = [field for field in REQUIRED_FIELDS if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        logging.info(f"🔄 Processing prediction for Crop: {data['Crop']}")

        # ✅ Convert Input Data to DataFrame
        test_data = pd.DataFrame([data])
        print("Test DataFrame:", test_data)  # Debugging line

        # ✅ Feature Engineering
        test_data["Rainfall_Temp_Ratio"] = test_data["Rainfall"] / (test_data["Temperature"] + 1)
        test_data["Soil_Moisture_Index"] = test_data["Soil_Moisture"] * test_data["pH"]
        test_data["Evapotranspiration_Eff"] = test_data["Evapotranspiration"] / test_data["Solar_Radiation"].replace(0, 0.01)

        preprocess_start = time.time()
        test_features = preprocessor.transform(test_data)
        preprocess_end = time.time()
        logging.info(f"⏳ Preprocessing time: {preprocess_end - preprocess_start:.2f}s")
        print("Transformed Features:", test_features)  # Debugging line

        test_features_csr = csr_matrix(test_features)

        # ✅ Predict Yield
        model_start = time.time()
        predicted_yield = round(float(model.predict(test_features_csr)[0]), 2)
        model_end = time.time()
        logging.info(f"⏳ Model prediction time: {model_end - model_start:.2f}s")
        print("Predicted Yield:", predicted_yield)  # Debugging line


        confidence_score = f"{round(metrics.get('r2_score', 0) * 100)}%"
        # ✅ Load Feature Names Safely
        try:
            num_features = preprocessor.transformers_[0][2]  
            cat_features = preprocessor.transformers_[1][1].get_feature_names_out().tolist()
            feature_names = num_features + cat_features
        except Exception as e:
            print(f"⚠️ Warning: Could not extract feature names: {e}")
            feature_names = []

        # ✅ Extract Feature Importances
        feature_importance_dict = {
            feature: f"{importance:.2%}"
            for feature, importance in zip(feature_names, model.feature_importances_)
        }


            # ✅ Filter Only Required Features
        selected_features = ["N_Soil", "P_Soil", "K_Soil", "Temperature", "Rainfall", "Soil_Moisture"]
        filtered_importance = {feature: feature_importance_dict.get(feature, "0%") for feature in selected_features}

                        
        # ✅ Recommended NPK values for crops (kg/ha)
        # ✅ Expanded Recommended NPK Values (kg/ha)
        RECOMMENDED_NPK = {
            "Rice": {"N": 120, "P": 60, "K": 40},
            "Wheat": {"N": 100, "P": 50, "K": 30},
            "Maize": {"N": 150, "P": 70, "K": 50},
            "Soybean": {"N": 30, "P": 60, "K": 30},
            "Cotton": {"N": 90, "P": 45, "K": 45},
            "Coffee": {"N": 100, "P": 50, "K": 50},
            "MothBeans": {"N": 20, "P": 40, "K": 20},
            "PigeonPeas": {"N": 25, "P": 50, "K": 25},
            "MungBean": {"N": 20, "P": 40, "K": 20},
            "Jute": {"N": 80, "P": 40, "K": 40},
            "Orange": {"N": 120, "P": 80, "K": 100},
            "Apple": {"N": 100, "P": 80, "K": 90},
            "Coconut": {"N": 500, "P": 300, "K": 1200}, 
            "Blackgram": {"N": 20, "P": 40, "K": 20},
            "Lentil": {"N": 30, "P": 50, "K": 30},
            "Banana": {"N": 250, "P": 100, "K": 300},
            "Pomegranate": {"N": 100, "P": 80, "K": 100},
            "Mango": {"N": 75, "P": 50, "K": 100},
            "Muskmelon": {"N": 50, "P": 60, "K": 40},
            "Watermelon": {"N": 50, "P": 60, "K": 40},
            "Grapes": {"N": 120, "P": 60, "K": 120},
            "KidneyBeans": {"N": 30, "P": 50, "K": 30},
            "ChickPea": {"N": 20, "P": 50, "K": 20}
        }

        # ✅ Fertilizer Calculation
        crop = test_data["Crop"].iloc[0]

        if crop in RECOMMENDED_NPK:
            soil_n = test_data["N_Soil"].iloc[0]
            soil_p = test_data["P_Soil"].iloc[0]
            soil_k = test_data["K_Soil"].iloc[0]

            # ✅ Calculate required fertilizer
            deficit_n = max(0, RECOMMENDED_NPK[crop]["N"] - soil_n)
            deficit_p = max(0, RECOMMENDED_NPK[crop]["P"] - soil_p)
            deficit_k = max(0, RECOMMENDED_NPK[crop]["K"] - soil_k)

            # ✅ Calculate required fertilizer formulations
            urea_needed = round(deficit_n / 0.46, 2) if deficit_n > 0 else 0  # Urea contains 46% Nitrogen
            dap_needed = round(deficit_p / 0.46, 2) if deficit_p > 0 else 0  # DAP contains 46% Phosphorus
            mop_needed = round(deficit_k / 0.60, 2) if deficit_k > 0 else 0  # MOP contains 60% Potassium

            # ✅ Fertilizer Recommendation Message
            if deficit_n == 0 and deficit_p == 0 and deficit_k == 0:
                recommendation_message = "No additional fertilizer is required."
            else:
                yield_improvement = max(0, 100 - (predicted_yield))
                recommendation_message = "To optimize yield, apply: "
                if urea_needed > 0:
                    recommendation_message += f"{urea_needed} kg/ha Urea, "
                if dap_needed > 0:
                    recommendation_message += f"{dap_needed} kg/ha DAP, "
                if mop_needed > 0:
                    recommendation_message += f"{mop_needed} kg/ha MOP, "
                recommendation_message += f"to potentially improve yield by {yield_improvement:.2f}%."

            # ✅ Store Fertilizer Recommendations in JSON Output
            fertilizer_use = {
                "N_Required": f"{deficit_n} kg/ha",
                "P_Required": f"{deficit_p} kg/ha",
                "K_Required": f"{deficit_k} kg/ha",
                "Urea": f"{urea_needed} kg/ha",
                "DAP": f"{dap_needed} kg/ha",
                "MOP": f"{mop_needed} kg/ha",
                "Recommendation": recommendation_message.strip().rstrip(",")  
            }

        else:
            fertilizer_use = {"Error": "Crop not found in database."}


        # ✅ Define Crop Coefficients (Kc) for Different Crops
        CROP_COEFFICIENTS = {
            "Rice": 1.1, "Wheat": 0.8, "Maize": 1.0, "Soybean": 0.9,
            "Cotton": 1.2, "Coffee": 1.1, "Banana": 1.3, "Apple": 0.7,
            "Mango": 0.8, "Pomegranate": 1.0, "Grapes": 1.1, "ChickPea": 0.6
        }

        # ✅ Extract Required Data for Irrigation Calculation
        temperature = test_data["Temperature"].iloc[0]
        solar_radiation = test_data["Solar_Radiation"].iloc[0]
        evapotranspiration = test_data["Evapotranspiration"].iloc[0]
        soil_moisture = test_data["Soil_Moisture"].iloc[0]
        rainfall = test_data["Rainfall"].iloc[0]
        wind_speed = test_data["Wind_Speed"].iloc[0]
        humidity = test_data["Humidity"].iloc[0]

        # ✅ Calculate Reference Evapotranspiration (ET₀) Approximation
        ET0 = (0.0023 * (temperature + 17.8) * (solar_radiation + 1) * (evapotranspiration + 0.1))  

        # ✅ Calculate Crop Water Requirement (CWR)
        kc = CROP_COEFFICIENTS.get(crop, 1.0)  # Default Kc = 1.0 if not found
        CWR = kc * ET0  # Crop Water Requirement in mm/day

        # ✅ Calculate Net Irrigation Requirement
        irrigation_needed = max(0, CWR - rainfall)  # If rainfall > CWR, no irrigation needed

        # ✅ Irrigation Recommendation
        if soil_moisture > 50:
            irrigation_advice = "Soil moisture is sufficient. No irrigation required."
        elif rainfall > CWR:
            irrigation_advice = "Rainfall is enough to meet crop water needs."
        else:
            irrigation_advice = f"Irrigation required: Apply {round(irrigation_needed, 2)} mm/day."

        # ✅ Store Irrigation Recommendation in Output JSON
        irrigation_output = {
            "ET0": round(ET0, 2),
            "Crop_Coefficient": kc,
            "CWR": round(CWR, 2),
            "Rainfall": rainfall,
            "Irrigation_Required": round(irrigation_needed, 2),
            "Recommendation": irrigation_advice
        }

        # ✅ Calculate Weather Impact on Crop Yield
        weather_impact_factors = ["Temperature", "Rainfall", "Wind_Speed", "Humidity", "Solar_Radiation"]
        weather_impact_score = sum(float(feature_importance_dict.get(factor, "0%").replace('%', '')) / 100 for factor in weather_impact_factors)
        weather_impact_percentage_p = round(weather_impact_score * 100, 2)
        weather_impact_percentage = f"{round(weather_impact_percentage_p * 100)}%"


        # ✅ Final Output JSON
        response = {
            "predicted_yield": f"{predicted_yield} tons/ha",
            "confidence_score": confidence_score,
            "feature_importance": filtered_importance,
            "fertilizer_use": fertilizer_use,
            "Irrigation_Output" : irrigation_output,
            "weather_impact": weather_impact_percentage, 
        }

        return jsonify(response)
   

    except Exception as e:
        print("❌ Flask Error:", e)
        traceback.print_exc()  # ✅ Add this
        return jsonify({"error": str(e)}), 500

    
@app.route("/", methods=["GET"])
def home():
    return "✅ Flask server is running on port 9090"

@app.errorhandler(Exception)
def handle_all_errors(e):
    import traceback
    print("⚠️ Global Error Caught:", e)
    traceback.print_exc()
    return jsonify({"error": "Internal server error"}), 500

@app.route("/ping", methods=['GET'])
def ping():
    return "pong", 200

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, port=9090)
