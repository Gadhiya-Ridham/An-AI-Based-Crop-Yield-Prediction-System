import pandas as pd

# ✅ Corrected file path using raw string (r"...")
csv_path = r"C:\Users\Ridham\Desktop\Mini Project\Project\dataset\climate_data.csv"

# ✅ Load the dataset
try:
    df = pd.read_csv(csv_path)
    print("✅ CSV file loaded successfully!")
    
    # ✅ Ensure "Crop" column exists
    if "Crop" in df.columns:
        # 🔹 Count occurrences of each unique crop
        state_counts = df["State"].value_counts()
        crop_counts = df["Crop"].value_counts()
        season_counts = df["Season"].value_counts()
        sw_counts = df["Sowing Month"].value_counts()
        hw_counts = df["Harvesting Month"].value_counts()
        soil_counts = df["Soil_Type"].value_counts()

        # 🔹 Display the count of each crop in the terminal
        print("\n📊 Crop Frequency Count:")
        print(crop_counts)

        print("\n📊 State Frequency Count:")
        print(state_counts)

        print("\n📊 Season Frequency Count:")
        print(season_counts)

        print("\n📊 sw Frequency Count:")
        print(sw_counts)

        print("\n📊 hw Frequency Count:")
        print(hw_counts)

        print("\n📊 soil Frequency Count:")
        print(soil_counts)

    else:
        print("❌ Error: 'Crop' column not found in the dataset.")

except FileNotFoundError:
    print("❌ Error: CSV file not found. Please check the file path.")
except Exception as e:
    print(f"❌ An unexpected error occurred: {e}")
