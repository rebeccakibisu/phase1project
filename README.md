# Kenya PAYE Calculator 2025

This is a single-page web application that calculates PAYE (Pay As You Earn) tax in Kenya for the year 2025. The calculator considers statutory deductions (NSSF, SHIF, Housing Levy), optional reliefs, and insurance benefits, and is fully aligned with Kenya's 2025 tax regulations.

## Features

* Real-time gross salary preview based on multiple income sources
* Auto-calculation of:

  * NSSF (Tier I & II)
  * SHIF (2.75%)
  * Housing Levy (1.5%)
* Optional deductions:

  * Pension Contributions (max 30,000)
  * Mortgage Interest (max 30,000)
  * Insurance Reliefs:

    * Life Insurance (max 5,000 with 15% relief)
    * Education Policy (max 5,000 with 15% relief)
    * Medical Insurance (max 5,000 with 15% relief)
  * Post-Retirement Medical Fund (max 15,000)
* Tax calculations using up-to-date PAYE brackets for 2025
* Tax relief application (including personal and insurance reliefs)
* Displays:

  * Gross Pay
  * Total Allowable Expenses
  * Net Taxable Income
  * Gross PAYE
  * Tax Relief and Insurance Relief
  * Final Net PAYE (never less than 0)

## Technologies Used

* **HTML5** — Semantic structure
* **CSS3** — Custom styling including 3D effect on form inputs
* **JavaScript (ES6+)** — Functional logic and DOM manipulation
* **json-server** — Local JSON REST API (using db.json)

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rebeccakibisu/kenya-paye-calculator.git

   ```

2. **Install `json-server` globally if not installed**:

   ```bash
   npm install -g json-server
   ```

3. **Start the JSON server**:

   ```bash
   json-server --watch db.json
   ```

4. **Open the project**:

   * Open `index.html` in your browser to access the PAYE Calculator.

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open-source and licensed under the MIT License.


