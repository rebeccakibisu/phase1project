# Kenya PAYE Calculator - 2025

## 👤 Author
Rebecca Vugutsa Kibisu

## 📝 Project Description

The **Kenya PAYE Calculator - 2025** is a web-based application designed to help employees, employers, and HR professionals in Kenya easily calculate monthly Pay As You Earn (PAYE) taxes and statutory deductions using updated 2025 tax rates.

Key features include:
- Dynamic calculation of Gross Salary
- Automatic computation of:
  - PAYE using progressive tax brackets
  - NSSF (Tier 1 and Tier 2)
  - NHIF contributions
  - Housing Levy
  - Personal and insurance reliefs
- Real-time gross salary preview
- Modern, user-friendly interface
- Data-driven configuration using a local `db.json` file with `json-server`

---

##  Live Demo

🌐 **Live on GitHub Pages**:  
[https://rebeccakibisu.github.io/phase1project]

> Note: You can eplace with your actual GitHub Pages URL after deployment.

---

## 📦 package.json

This project includes a `package.json` file for dependency management. It enables you to:

* Run a local JSON server for mocking API responses from `db.json`
* Install and manage project dependencies like `json-server` and development tools

### 📁 Sample `package.json`:

```json
{
  "name": "kenya-paye-calculator",
  "version": "1.0.0",
  "description": "A web-based tool to calculate PAYE, NHIF, NSSF, and housing levy for Kenyan employees (2025).",
  "main": "script.js",
  "scripts": {
    "start": "json-server --watch db.json --port 3002"
  },
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "json-server": "^0.17.4"
  }
}
```

### 🔧 Install Dependencies

```bash
npm install
```

### ▶️ Run JSON Server

```bash
npm start
```

This will start a local server at `http://localhost:3002` which serves your `db.json` configuration.

---

## 🗂 Folder Structure

```
project-root/
├── index.html
├── style.css
├── script.js
├── db.json
└── package.json
```
##  Project Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/)
- A modern browser
- Code editor (e.g., VS Code)

### 1. Clone the repository
```bash
git clone https://github.com/rebeccakibisu/phase1project.git
cd phase1project/
```

### 2. Install `json-server`
```bash
npm install -g json-server
```

### 3. Start the JSON server
```bash
json-server --watch db.json --port 3002
```

### 4. Run the application
Open `index.html` in your browser or use Live Server in VS Code.

---

## 📁 Project Structure

```
kenya-paye-calculator/
├── index.html         # Main HTML structure
├── style.css          # All styles and animations
├── script.js          # JavaScript logic and fetch operations
├── db.json            # Tax brackets and deduction rules
├── README.md          # Project documentation
└── package.json       # Project dependencies and json-server script

```

---

## 📄 License

© 2025 Rebecca Vugutsa Kibisu

This project is licensed under the **MIT License**.

You are free to use, distribute, and modify this software under the conditions of the license.

---

## 🤝 Contributions

Contributions are welcome!  
If you'd like to improve this tool, please fork the repo, create a branch, make your changes, and submit a pull request.
Please acknowledge me as the auther.
---

##  Contact

For questions, feedback, or collaboration:  
reach out through github. My user name is rebeccakibisu.