const sowingHarvestingData = {
  Coffee: { season: "Summer", sowingMonth: "March", harvestingMonth: "July" },
  Mango: { season: "Summer", sowingMonth: "June", harvestingMonth: "October" },
  Muskmelon: {
    season: "Summer",
    sowingMonth: "March",
    harvestingMonth: "July",
  },
  Watermelon: {
    season: "Summer",
    sowingMonth: "March",
    harvestingMonth: "July",
  },
  Grapes: { season: "Summer", sowingMonth: "June", harvestingMonth: "October" },
  MothBeans: {
    season: "Kharif",
    sowingMonth: "June",
    harvestingMonth: "October",
  },
  PigeonPeas: {
    season: "Kharif",
    sowingMonth: "June",
    harvestingMonth: "October",
  },
  Rice: { season: "Kharif", sowingMonth: "June", harvestingMonth: "October" },
  MungBean: {
    season: "Kharif",
    sowingMonth: "June",
    harvestingMonth: "October",
  },
  Jute: { season: "Kharif", sowingMonth: "March", harvestingMonth: "July" },
  Maize: { season: "Kharif", sowingMonth: "June", harvestingMonth: "October" },
  Cotton: { season: "Kharif", sowingMonth: "June", harvestingMonth: "October" },
  Blackgram: {
    season: "Kharif",
    sowingMonth: "June",
    harvestingMonth: "October",
  },
  KidneyBeans: {
    season: "Kharif",
    sowingMonth: "June",
    harvestingMonth: "October",
  },
  Orange: { season: "Rabi", sowingMonth: "October", harvestingMonth: "March" },
  Apple: { season: "Rabi", sowingMonth: "October", harvestingMonth: "March" },
  Wheat: { season: "Rabi", sowingMonth: "October", harvestingMonth: "March" },
  Lentil: { season: "Rabi", sowingMonth: "October", harvestingMonth: "March" },
  Banana: { season: "Rabi", sowingMonth: "March", harvestingMonth: "July" },
  Pomegranate: {
    season: "Rabi",
    sowingMonth: "June",
    harvestingMonth: "October",
  },
  ChickPea: {
    season: "Rabi",
    sowingMonth: "October",
    harvestingMonth: "March",
  },
  Coconut: { season: "Rabi", sowingMonth: "March", harvestingMonth: "July" },
};

const cropSoilMapping = {
  Coffee: "Acidic Soil",
  Mango: "Loamy Soil",
  Muskmelon: "Sandy Soil",
  Watermelon: "Sandy Soil",
  Grapes: "Loamy Soil",
  MothBeans: "Sandy Soil",
  PigeonPeas: "Loamy Soil",
  Rice: "Acidic Soil",
  MungBean: "Loamy Soil",
  Jute: "Alkaline Soil",
  Maize: "Loamy Soil",
  Cotton: "Alkaline Soil",
  Blackgram: "Loamy Soil",
  KidneyBeans: "Loamy Soil",
  Orange: "Acidic Soil",
  Apple: "Acidic Soil",
  Wheat: "Loamy Soil",
  Lentil: "Loamy Soil",
  Banana: "Loamy Soil",
  Pomegranate: "Alkaline Soil",
  ChickPea: "Alkaline Soil",
  Coconut: "Sandy Soil",
};

export const getSowingHarvestingMonth = (cropName) => {
  if (!cropName)
    return {
      sowingMonth: "Unknown",
      harvestingMonth: "Unknown",
      season: "Unknown",
    };

  const cropKey = Object.keys(sowingHarvestingData).find(
    (c) => c.toLowerCase() === cropName.trim().toLowerCase()
  );

  return (
    sowingHarvestingData[cropKey] || {
      sowingMonth: "Unknown",
      harvestingMonth: "Unknown",
      season: "Unknown",
    }
  );
};

export const getSoilType = (cropName) => {
  if (!cropName) return "Unknown";

  const cropKey = Object.keys(cropSoilMapping).find(
    (c) => c.toLowerCase() === cropName.trim().toLowerCase()
  );

  return cropSoilMapping[cropKey] || "Unknown";
};

const getRandomInRange = (min, max) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

export const calculatePH = (N, P, K, Rainfall) => {
  let ph = 7 - 0.01 * Rainfall + 0.02 * N + 0.015 * P + 0.01 * K;
  
  // Ensuring pH stays within 4.5 - 9
  if (ph < 4.5 || ph > 9) {
    ph = getRandomInRange(5.5, 8);
  }
  return parseFloat(ph).toFixed(2);
};

export const calculateWindSpeed = (Temperature, Humidity) => {
  let windSpeed = 0.1 * Temperature - 0.05 * Humidity + 5;
  
  // Ensuring wind speed stays within 0.5 - 15 m/s
  if (windSpeed < 0.5 || windSpeed > 15) {
    windSpeed = getRandomInRange(2, 10);
  }
  return parseFloat(windSpeed).toFixed(2);
};

export const calculateSolarRadiation = (Temperature, Humidity) => {
  let solarRadiation = 10 + 0.5 * Temperature - 0.3 * Humidity;
  
  // Ensuring solar radiation stays within 5 - 30 MJ/m²/day
  if (solarRadiation < 5 || solarRadiation > 30) {
    solarRadiation = getRandomInRange(8, 25);
  }
  return parseFloat(solarRadiation).toFixed(2);
};

export const calculateEvapotranspiration = (Temperature, WindSpeed, Humidity, SolarRadiation) => {
  let evapotranspiration = 0.0023 * Temperature + 0.1 * WindSpeed - 0.05 * Humidity + 0.02 * SolarRadiation;
  
  // Ensuring evapotranspiration stays within 0 - 10 mm/day
  if (evapotranspiration < 0 || evapotranspiration > 10) {
    evapotranspiration = getRandomInRange(2, 8);
  }
  return parseFloat(evapotranspiration).toFixed(2);
};

export const calculateSoilMoisture = (Rainfall, Evapotranspiration) => {
  let soilMoisture = Rainfall - Evapotranspiration * 5;
  
  // Ensuring soil moisture stays within 5% - 60%
  if (soilMoisture < 5 || soilMoisture > 60) {
    soilMoisture = getRandomInRange(10, 50);
  }
  return parseFloat(soilMoisture).toFixed(2);
};
