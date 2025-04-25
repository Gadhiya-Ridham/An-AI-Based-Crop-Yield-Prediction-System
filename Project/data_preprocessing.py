import os
import pandas as pd
import numpy as np
import chardet
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from scipy.stats import zscore
from imblearn.over_sampling import SMOTE


# Paths
input_file = "Project/dataset/climate_data.csv"
output_folder = "Project/Output_Folder/processed_data"
os.makedirs(output_folder, exist_ok=True)

# Check if dataset exists
if not os.path.exists(input_file):
    raise FileNotFoundError("❌ Dataset not found! Please check the file path.")

# Detect encoding and read file
try:
    df = pd.read_csv(input_file, encoding="utf-8")
except UnicodeDecodeError:
    with open(input_file, 'rb') as f:
        encoding = chardet.detect(f.read(100000))['encoding']
    df = pd.read_csv(input_file, encoding=encoding)

# Clean column names
df.columns = df.columns.str.strip().str.replace("[^a-zA-Z0-9_]", "", regex=True)

# Drop unnecessary columns
drop_cols = ["SR_No", "Unnamed_20"]
df.drop(columns=[col for col in drop_cols if col in df.columns], errors="ignore", inplace=True)

# Validate required columns
required_cols = ["Yield", "State", "Crop", "Season", "Soil_Type", "Sowing_Month", "Harvesting_Month"]
missing_required = [col for col in required_cols if col not in df.columns]
if missing_required:
    raise ValueError(f"❌ Required columns missing: {missing_required}")

# Fill missing values
for col in df.columns:
    if df[col].dtype == "object":
        df[col].fillna(df[col].mode()[0], inplace=True)
    else:
        df[col].fillna(df[col].median(), inplace=True)

# Encode categorical columns
label_encoders = {}
categorical_cols = ["State", "Crop", "Season", "Soil_Type", "Sowing_Month", "Harvesting_Month"]
df_encoded = df.copy()

for col in categorical_cols:
    if col in df.columns:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le

# Save label encoders
with open(os.path.join(output_folder, "label_encoders.pkl"), "wb") as f:
    pickle.dump(label_encoders, f)

# Normalize numerical features
numerical_cols = ["N_Soil", "P_Soil", "K_Soil", "Temperature", "Humidity", "pH",
                  "Rainfall", "Wind_Speed", "Solar_Radiation", "Evapotranspiration",
                  "Soil_Moisture", "Area"]
numerical_cols = [col for col in numerical_cols if col in df_encoded.columns]

# Outlier Removal using Z-score
df_encoded[numerical_cols] = df_encoded[numerical_cols].apply(zscore)
df_encoded = df_encoded[(np.abs(df_encoded[numerical_cols]) < 3).all(axis=1)]

# Re-scale after outlier removal
scaler = StandardScaler()
df_encoded[numerical_cols] = scaler.fit_transform(df_encoded[numerical_cols])

# Save scaler
with open(os.path.join(output_folder, "scaler.pkl"), "wb") as f:
    pickle.dump(scaler, f)

# Separate features & target
X = df_encoded.drop(columns=["Yield"])
y = df_encoded["Yield"]

# Apply PCA (Optional – keep 95% variance)
apply_pca = False
if apply_pca:
    pca = PCA(n_components=0.95)
    X = pca.fit_transform(X)
    with open(os.path.join(output_folder, "pca.pkl"), "wb") as f:
        pickle.dump(pca, f)
        


# Apply KNN-SMOTE (for regression-style oversampling)
apply_smote = False
if apply_smote:
    smote = SMOTE()

    X_resampled, y_resampled = smote.fit_resample(X, y)


# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Save processed data
pd.DataFrame(X_train).to_csv(os.path.join(output_folder, "X_train.csv"), index=False)
pd.DataFrame(X_test).to_csv(os.path.join(output_folder, "X_test.csv"), index=False)
pd.DataFrame(y_train).to_csv(os.path.join(output_folder, "y_train.csv"), index=False)
pd.DataFrame(y_test).to_csv(os.path.join(output_folder, "y_test.csv"), index=False)

print(f"✅ Final Preprocessing Complete! Processed data saved to '{output_folder}'")
