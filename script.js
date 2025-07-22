const API_URL = "http://localhost:3002/config";
let configData = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchConfig();
  document.getElementById("payeForm").addEventListener("submit", handleSubmit);
});

// Fetch the full config object from /config
async function fetchConfig() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Invalid response from server");
    configData = await res.json();
    console.log("Fetched config:", configData);
  } catch (error) {
    console.error("Error fetching config:", error.message);
    alert("Failed to load tax configuration. Please check if json-server is running.");
  }
}

function handleSubmit(e) {
  e.preventDefault();

  const gross = parseFloat(document.getElementById("basicSalary").value) || 0;
  const mortgage = parseFloat(document.getElementById("mortgageInterest").value) || 0;
  const insurance = parseFloat(document.getElementById("insuranceRelief").value) || 0;

  const nhif = gross * (configData.shif?.rate || 0.0275);
  const housing = gross * (configData.housingLevy?.employeeRate || 0.015);
  const nssf = calculateNSSF(gross);

  const totalDeductions = nhif + housing + nssf + mortgage;
  const taxable = gross - totalDeductions;

  const payeBeforeRelief = computePAYE(taxable);
  const personalRelief = configData.personalRelief?.monthlyAmount || 2400;
  const insuranceRelief = Math.min(insurance, 5000) * 0.15;

  const finalPAYE = Math.max(0, payeBeforeRelief - personalRelief - insuranceRelief);

  document.getElementById("netPaye").textContent = `KES ${finalPAYE.toFixed(2)}`;
}

function calculateNSSF(gross) {
  const nssf = configData.nssf;
  if (!nssf) return 0;

  const tier1 = Math.min(gross, nssf.tier1.lowerEarningLimit) * nssf.tier1.rate;
  const tier2 = Math.min(Math.max(gross - nssf.tier1.lowerEarningLimit, 0),
    nssf.tier2.upperEarningLimit - nssf.tier1.lowerEarningLimit) * nssf.tier2.rate;

  return Math.min(tier1 + tier2, nssf.maxContribution);
}

function computePAYE(income) {
  const brackets = configData.taxBrackets;
  if (!Array.isArray(brackets)) return 0;

  let tax = 0;

  for (const bracket of brackets) {
    const { min, max, rate } = bracket;
    if (income > min) {
      const upper = max !== null ? Math.min(income, max) : income;
      tax += (upper - min) * rate;
    }
  }

  return tax;
}
