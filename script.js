// Base URL for fetching config data from local json-server
const API_URL = "http://localhost:3002";

// Will hold the fetched tax configuration and relief values
let configData = {};

// Wait for DOM to fully load before attaching events
document.addEventListener("DOMContentLoaded", () => {
  fetchConfig();
  setupGrossIncomeListener();
  document.getElementById("payeForm").addEventListener("submit", handleSubmit);
});

// Fetch PAYE configuration data (tax brackets, reliefs, NSSF) from db.json
async function fetchConfig() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    configData = await response.json();
    console.log("Fetched config:", configData);
  } catch (error) {
    console.error("Failed to fetch config:", error.message);
  }
}

// Attach input listeners to income fields to update gross salary live
function setupGrossIncomeListener() {
  const incomeFields = [
    "basicSalary",
    "houseAllowance",
    "transportAllowance",
    "entertainmentAllowance",
    "overtimePay",
    "bonus",
    "otherAllowances"
  ];

  incomeFields.forEach(id => {
    document.getElementById(id).addEventListener("input", updateGross);
  });
}

// Calculate gross salary and update preview + statutory deductions
function updateGross() {
  const incomeFields = [
    "basicSalary",
    "houseAllowance",
    "transportAllowance",
    "entertainmentAllowance",
    "overtimePay",
    "bonus",
    "otherAllowances"
  ];

  // Compute gross salary from all income fields
  let gross = incomeFields.reduce((total, id) => {
    const value = parseFloat(document.getElementById(id).value) || 0;
    return total + value;
  }, 0);

  // Update UI with gross salary
  document.getElementById("grossPreview").textContent = `KES ${gross.toFixed(2)}`;
  document.getElementById("totalGross").textContent = `KES ${gross.toFixed(2)}`;

  // Recalculate statutory deductions based on new gross
  calculateStatutoryDeductions(gross);
}

// Calculate NSSF, SHIF, and Housing Levy deductions and update fields
function calculateStatutoryDeductions(gross) {
  const nssf = calculateNSSF(gross);
  const shif = gross * 0.0275;
  const housing = gross * 0.015;

  document.getElementById("nssf").value = `KES ${nssf.toFixed(2)}`;
  document.getElementById("shif").value = `KES ${shif.toFixed(2)}`;
  document.getElementById("housingLevy").value = `KES ${housing.toFixed(2)}`;
}

// Compute NSSF Tier 1 + Tier 2 deduction capped at maxContribution
function calculateNSSF(gross) {
  const { nssf } = configData;
  console.log("NSSF config:", nssf);
  if (!nssf) return 0;

  const tier1 = Math.min(gross, nssf.tier1.lowerEarningLimit) * nssf.tier1.rate;
  const tier2 = Math.min(Math.max(gross - nssf.tier1.lowerEarningLimit, 0), nssf.tier2.upperEarningLimit - nssf.tier1.lowerEarningLimit) * nssf.tier2.rate;

  const total = tier1 + tier2;
  console.log(`Tier1: ${tier1}, Tier2: ${tier2}, Total before cap: ${total}`);
  
  return Math.min(total, nssf.maxContribution);
  
}

// Form submission handler to calculate PAYE and deductions
function handleSubmit(e) {
  e.preventDefault();

  // Get gross salary from UI
  const gross = parseFloat(document.getElementById("totalGross").textContent.replace("KES", "")) || 0;
  const nssf = calculateNSSF(gross);
  const shif = gross * 0.0275;
  const housing = gross * 0.015;

  // Optional deductions like pension/mortgage/retirement fund
  const optionalDeductions = [
    "pensionContribution",
    "mortgageInterest",
    "postRetirementFund"
  ];

  // Insurance-based deductions with 15% relief
  const insuranceDeductions = [
    "lifeInsurance",
    "educationInsurance",
    "medicalInsurance"
  ];

  // Sum optional deductions
  const totalOptional = optionalDeductions.reduce((sum, id) => {
    return sum + (parseFloat(document.getElementById(id).value) || 0);
  }, 0);

  // Sum 15% of insurance premiums
  const insuranceRelief = insuranceDeductions.reduce((sum, id) => {
    const value = parseFloat(document.getElementById(id).value) || 0;
    return sum + value * 0.15;
  }, 0);

  // Compute net taxable income
  const allowableExpenses = nssf + shif + housing + totalOptional;
  const netTaxableIncome = gross - allowableExpenses;

  // Compute gross PAYE from tax brackets
  let grossPaye = 0;
  if (configData.taxBrackets) {
    grossPaye = computePAYE(netTaxableIncome, configData.taxBrackets);
  }

  const personalRelief = configData.personalRelief?.monthlyAmount || 2400;
  const netPaye = Math.max(0, grossPaye - personalRelief - insuranceRelief);

  // Update results in UI
  document.getElementById("totalAllowable").textContent = `KES ${allowableExpenses.toFixed(2)}`;
  document.getElementById("netTaxable").textContent = `KES ${netTaxableIncome.toFixed(2)}`;
  document.getElementById("grossPaye").textContent = `KES ${grossPaye.toFixed(2)}`;
  document.getElementById("taxRelief").textContent = `KES ${personalRelief.toFixed(2)}`;
  document.getElementById("insuranceRelief").textContent = `KES ${insuranceRelief.toFixed(2)}`;
  document.getElementById("netPaye").textContent = `KES ${netPaye.toFixed(2)}`;

  console.log("Net taxable income:", netTaxableIncome);
  console.log("Tax brackets:", configData.taxBrackets);

}

// Calculate PAYE using progressive tax brackets
function computePAYE(income, brackets) {
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const { min, max, rate } = brackets[i];
    if (income > min) {
      const upper = max ?? income; // if max is null, use full income
      const taxable = Math.min(income, upper) - min;
      tax += taxable * rate;
      
    }
    
  }
  console.log("Net Taxable Income:", netTaxableIncome);
  console.log("Tax Brackets:", configData.taxBrackets);
  console.log("Gross PAYE:", grossPaye);
  console.log("Computing PAYE on:", income);


  return tax;



}
