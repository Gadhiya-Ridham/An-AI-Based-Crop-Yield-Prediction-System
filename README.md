# 🌾 CropAnalisi – AI-Driven Crop Yield Prediction System

![CropAnalisi Screenshot 1](./demo%20images//demo%201.png)
![CropAnalisi Screenshot 2](./demo%20images//demo%202.png)

CropAnalisi is a smart web-based solution that uses machine learning to predict crop yield based on climate, soil, and agricultural inputs. It offers AI-driven recommendations for fertilizers, irrigation, and more to boost agricultural efficiency.

---

## 📁 Folder Structure

CropAnalisi/
├── frontend/           # React frontend (user input, UI)
├── node_modules/       # Node.js dependencies
├── Project/            # Flask backend (test_model.py, model logic) Possibly model files, training code
├── Server/             # Database Connection Code
├── package.json        # React app metadata and dependencies
├── package-lock.json   # Locked versions of Node packages
└── README.md           # This documentation file

---

## ⚙️ System Requirements

- Python 3.8 or higher
- Node.js v16 or higher
- MongoDB installed (or MongoDB Atlas)
- `concurrently` for running frontend + backend

---

## 🔧 Setup Instructions

### 1️⃣ Install Backend Requirements

```bash
cd Server
python -m venv ../.venv
# Activate the virtual environment:
# Windows:
../.venv/Scripts/activate
# macOS/Linux:
source ../.venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

### 2️⃣ Install Frontend Requirements

```bash
cd ../frontend
npm install
```

---

### 3️⃣ Setup concurrently

```bash
#install concurrently in the root directory:
npm install concurrently --save-dev

#Update your root-level package.json like this:
#Windows:
"scripts": { "dev": "concurrently \"npm run frontend\" \"npm run backend\"",
    "frontend": "cd frontend && npm run dev",
    "backend": "cd server && npm start" },
#macOS/Linux:
🔁 On macOS/Linux: Replace ../.venv/Scripts/python with ../.venv/bin/python
```

---

🚀 Run the Project
```bash
npm run dev
```
This will:
    🧠 Launch the Flask backend at http://localhost:5000
    💻 Start the React frontend at http://localhost:3000

💡 Features
    -> ✅ Predict crop yield using real-time soil and climate data
    -> 🤖 AI-powered recommendations (fertilizer, irrigation, pesticides)
    -> 📸 Image upload support (future enhancement)
    -> 🌿 MongoDB integration for prediction logging 
    -> 🧑‍🌾 Clean and interactive UI

🧠 Author
-> Ridham Gadhiya 

---

📃 License
This project is for academic and research use only.

---


