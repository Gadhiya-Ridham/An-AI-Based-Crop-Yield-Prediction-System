import os
import math
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Define file paths
X_train_file = "Project/Output_Folder/processed_data/X_train.csv"
y_train_file = "Project/Output_Folder/processed_data/y_train.csv"
output_folder = "Project/Output_Folder/eda_plots"

# Function to delete existing EDA plots if an error occurs
def delete_existing_plots():
    if os.path.exists(output_folder):
        for file in os.listdir(output_folder):
            os.remove(os.path.join(output_folder, file))
        os.rmdir(output_folder)
        print("[DELETE] Deleted existing EDA plots due to an error. Retrying...")

try:
    if not os.path.exists(X_train_file) or not os.path.exists(y_train_file):
        print("❌ Processed datasets not found! Please run `feature_engineering.py` first.")
        exit()

    # Always recreate the output folder (remove existing files)
    os.makedirs(output_folder, exist_ok=True)
    for file in os.listdir(output_folder):
        os.remove(os.path.join(output_folder, file))

    # Load datasets
    X_train = pd.read_csv(X_train_file)
    y_train = pd.read_csv(y_train_file)
    y_train.columns = ["Yield"]

    df = pd.concat([X_train, y_train], axis=1)
    df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

    print("\n[INFO] Dataset Info:")
    df.info()

    print("\n[INFO] First 5 Rows:")
    print(df.head())

    print("\n[INFO] Missing Values:")
    print(df.isnull().sum()[df.isnull().sum() > 0])

    print(f"\n[INFO] Duplicate Rows: {df.duplicated().sum()}")

    print("\n[INFO] Summary Statistics:")
    print(df.describe())

    # Convert and handle missing values
    df = df.apply(pd.to_numeric, errors='coerce')
    df.fillna(df.median(numeric_only=True), inplace=True)

    print("\n[INFO] Generating EDA Plots...")

    # 🔹 Feature Distributions
    num_features = len(df.columns)
    num_rows = math.ceil(num_features / 4)
    plt.figure(figsize=(15, 12))
    df.hist(figsize=(15, 12), bins=30, edgecolor='black', layout=(num_rows, 4))
    plt.suptitle("Feature Distributions", fontsize=16, fontweight='bold')
    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.savefig(os.path.join(output_folder, "feature_distributions.png"))
    plt.close()

    # 🔹 Correlation Heatmap
    plt.figure(figsize=(12, 8))
    numeric_df = df.select_dtypes(include=['number'])
    sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.5)
    plt.title("Feature Correlation Heatmap (Includes Yield)")
    plt.savefig(os.path.join(output_folder, "correlation_heatmap.png"))
    plt.close()

    # 🔹 Bar Plots for Mean of Each Feature
    means = df.mean(numeric_only=True).sort_values()
    plt.figure(figsize=(12, 8))
    sns.barplot(x=means.values, y=means.index, palette='viridis')
    plt.title("Mean Value of Each Numeric Feature (Including Yield)")
    plt.xlabel("Mean Value")
    plt.ylabel("Features")
    plt.tight_layout()
    plt.savefig(os.path.join(output_folder, "mean_feature_bars.png"))
    plt.close()

    # 🔹 Yield Distribution
    plt.figure(figsize=(10, 6))
    sns.histplot(y_train, bins=50, kde=True, color='blue')
    plt.xlabel("Yield")
    plt.ylabel("Frequency")
    plt.title("Yield Distribution")
    plt.savefig(os.path.join(output_folder, "yield_distribution.png"))
    plt.close()

    # 🔹 Bar Plots: Yield vs Top Features
    top_corr_features = numeric_df.corr()["Yield"].abs().sort_values(ascending=False)[1:6].index
    for feature in top_corr_features:
        plt.figure(figsize=(8, 5))
        sns.barplot(x=df[feature], y=df["Yield"], ci=None)
        plt.xlabel(feature)
        plt.ylabel("Yield")
        plt.title(f"Bar Plot: {feature} vs. Yield")
        plt.tight_layout()
        plt.savefig(os.path.join(output_folder, f"{feature}_vs_yield.png"))
        plt.close()

    print(f"\n✅ EDA Completed! Plots saved in '{output_folder}' folder.")

except Exception as e:
    print(f"\n[ERROR] {e}")
    delete_existing_plots()
    print("[RETRY] Please run the script again.")
