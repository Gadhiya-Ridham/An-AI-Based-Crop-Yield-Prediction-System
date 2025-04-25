const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const crypto = require("crypto");
const { spawn } = require("child_process");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = "mongodb://localhost:27017/";
const DATABASE_NAME = "Ai-CropYeild_Database";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Function to Check & Create Database
async function checkAndCreateDatabase() {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const databasesList = await client.db().admin().listDatabases();
    const dbExists = databasesList.databases.some(
      (db) => db.name === DATABASE_NAME
    );

    if (!dbExists) {
      console.log(`🚀 Creating Database: ${DATABASE_NAME}...`);
      await client
        .db(DATABASE_NAME)
        .collection("temp")
        .insertOne({ init: true });
      await client.db(DATABASE_NAME).collection("temp").deleteMany({});
    } else {
      console.log(`✅ Database "${DATABASE_NAME}" exists.`);
    }

    await client.close();
  } catch (error) {
    console.error("❌ Error checking/creating database:", error);
  }
}

// ✅ Connect to MongoDB
mongoose
  .connect(`${MONGO_URL}${DATABASE_NAME}`)
  .then(() =>
    console.log(`✅ Connected to MongoDB - Database: ${DATABASE_NAME}`)
  )
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Run Database Check
checkAndCreateDatabase();

const userInputSchema = new mongoose.Schema(
  {
    Year: Number,
    State: String,
    Crop: String,
    N_Soil: Number,
    P_Soil: Number,
    K_Soil: Number,
    Temperature: Number,
    Humidity: Number,
    Rainfall: Number,
    Area: Number,
    Sowing_Month: String,
    Harvesting_Month: String,
    Season: String,
    Soil_Type: String,
    pH: Number,
    Wind_Speed: Number,
    Solar_Radiation: Number,
    Evapotranspiration: Number,
    Soil_Moisture: Number,
  },
  {
    timestamps: true,
  }
);

const predictionSchema = new mongoose.Schema({
  input: Object,
  output: Object,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserInput = mongoose.model("UserInput", userInputSchema);
const Prediction = mongoose.model("Prediction", predictionSchema);

app.post("/savePrediction", async (req, res) => {
  try {
    const { input, output } = req.body;

    if (!input || !output) {
      return res.status(400).json({ error: "Input and output are required." });
    }

    const newPrediction = new Prediction({ input, output });
    await newPrediction.save();
    console.log("✅ Prediction saved to MongoDB");
    res.status(200).json({ message: "Prediction saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving prediction:", error);
    res.status(500).json({ error: "Failed to save prediction." });
  }
});



app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
