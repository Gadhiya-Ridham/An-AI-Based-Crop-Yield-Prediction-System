import pandas as pd
import numpy as np
import os
import joblib
from scipy.sparse import csr_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error, r2_score
import xgboost as xgb
import json
import matplotlib.pyplot as plt

# ✅ Load Dataset
data_path = "Project/dataset/climate_data.csv"

if not os.path.exists(data_path):
    raise FileNotFoundError("❌ Dataset file is missing. Please provide the dataset.")

df = pd.read_csv(data_path, low_memory=False)

# ✅ Remove 'Production' to prevent data leakage
if "Production" in df.columns:
    df = df.drop(columns=["Production"])

# ✅ Features & Target
X = df.drop(columns=["Yield", "State"])
y = df["Yield"]

# 🚀 **Remove Less Important Features**
features_to_drop = [
    "Crop_Coconut", "Crop_Cotton", "Crop_Apple", "Crop_Maize", "Crop_Papaya",
    "Crop_Watermelon", "Crop_Muskmelon", "Season_Rabi", "Season_Kharif", 
    "Soil_Type_Alkaline Soil", "Soil_Type_Loamy Soil", "Sowing_Month_October", 
    "Harvesting_Month_March"
]
X = X.drop(columns=features_to_drop, errors="ignore")

# ✅ Feature Engineering: Creating new features BEFORE encoding
X["Rainfall_Temp_Ratio"] = X["Rainfall"] / (X["Temperature"] + 1)
X["Soil_Moisture_Index"] = X["Soil_Moisture"] * X["pH"]
X["Evapotranspiration_Eff"] = X["Evapotranspiration"] / (X["Solar_Radiation"] + 1)

# ✅ Identify categorical & numerical features
categorical_cols = ["Crop", "Sowing_Month", "Harvesting_Month", "Soil_Type", "Season"]
numerical_cols = [col for col in X.columns if col not in categorical_cols]

# ✅ Preprocessing Pipeline
preprocessor = ColumnTransformer([
    ("num", StandardScaler(), numerical_cols),  
    ("cat", OneHotEncoder(handle_unknown="ignore", drop="first"), categorical_cols)
])

# ✅ Transform Data
X_encoded = preprocessor.fit_transform(X)
X_encoded = X_encoded.astype(np.float32)  # Convert to float32 for efficiency

# ✅ Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

# ✅ Convert X_train to csr_matrix (for GPU efficiency)
X_train_csr = csr_matrix(X_train)
X_test_csr = csr_matrix(X_test)

# ✅ Optimized XGBoost Model
model = xgb.XGBRegressor(
    tree_method="gpu_hist",
    learning_rate=0.03,  
    n_estimators=1500,   
    max_depth=5,        
    reg_lambda=15,      
    reg_alpha=5,        
    subsample=0.8,       
    colsample_bytree=0.8,
    early_stopping_rounds=50,  
    random_state=42,
    eval_metric="rmse"  # ✅ Correct placement
)

# ✅ Train Model with Early Stopping
model.fit(
    X_train_csr, y_train,
    eval_set=[(X_test_csr, y_test)],  
    verbose=True
)

# ✅ Extract Feature Names
feature_names = (
    numerical_cols +
    preprocessor.named_transformers_["cat"].get_feature_names_out(categorical_cols).tolist()
)

# ✅ Compute Feature Importance
feature_importance = pd.DataFrame({
    "Feature": feature_names,
    "Importance": model.feature_importances_
}).sort_values(by="Importance", ascending=False)

# ✅ Print Top Features
print("\n🔍 Top 10 Important Features:")
print(feature_importance.head(10))

# ✅ Create Output Folder
output_folder = "Project/Output_Folder/models"
os.makedirs(output_folder, exist_ok=True)

# ✅ Save Feature Importance
feature_importance.to_csv(os.path.join(output_folder, "feature_importance.csv"), index=False)

# ✅ Define Paths for Saving Model & Preprocessor
model_path = os.path.join(output_folder, "xgboost_model.pkl")
preprocessor_path = os.path.join(output_folder, "preprocessor.pkl")
metrics_path = os.path.join(output_folder, "metrics.json")

# ✅ Save Model & Preprocessor
joblib.dump(model, model_path)
joblib.dump(preprocessor, preprocessor_path)

# ✅ Predict using csr_matrix
y_pred = model.predict(X_test_csr)

# ✅ Evaluate Model
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# 📊 Feature Importance Plot
plt.figure(figsize=(10, 5))
xgb.plot_importance(model, importance_type="gain")
plt.title("Feature Importance (Gain)")
plt.savefig(os.path.join(output_folder, "feature_importance.png"))  
plt.close()  

print("\n📊 Model Performance:")
print(f"🔹 Mean Absolute Error (MAE): {mae:.4f}")
print(f"🔹 R² Score: {r2:.4f}")

# ✅ Save Metrics
metrics = {
    "r2_score": round(r2, 4),
    "MAE": round(mae, 4),
    "Feature_Count": X.shape[1]
}

with open(metrics_path, "w") as f:
    json.dump(metrics, f, indent=4)

print(f"\n📊 Updated Model Metrics:")
print(f"🔹 R² Score: {metrics['r2_score']}")
print(f"🔹 Mean Absolute Error (MAE): {metrics['MAE']}")

print(f"\n✅ Model saved at: {model_path}")
print(f"✅ Preprocessor saved at: {preprocessor_path}")
print(f"✅ Metrics saved at: {metrics_path}")
    