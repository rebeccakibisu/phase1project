// script.js

let grossPay = 0;

const incomeInputs = [
  "basicSalary",
  "houseAllowance",
  "transportAllowance",
  "entertainmentAllowance",
  "overtimePay",
  "bonus",
  "otherAllowances"
];

// Attach real-time input listeners to income fields
document.addEventListener("DOMContentLoaded", () => {
  incomeInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", updateGrossPreview);
    }
  });

  document.getElementById("payeForm").addEventListener("submit", calculatePAYE);
});

function updateGrossPreview() {
  grossPay = incomeInputs.reduce((sum, id) => {
    const val = parseFloat(document.getElementById(id).value) || 0;
    return sum + val;
  }, 0);
  document.getElementById("grossPreview").textContent = `KES ${grossPay.toFixed(2)}`;
  document.getElementById("totalGross").textContent = `KES ${grossPay.toFixed(2)}`;
}

async function calculatePAYE(event) {
  event.preventDefault();

  // Fetch deductions and tax rules from db.json (json-server)
  const [nssfData, shifData, housingData, taxBrackets, reliefs, optionalDeductions] = await Promise.all([
    fetch("http://localhost:3000/nssf").then(res => res.json()),
    fetch("http://localhost:3000/shif").then(res => res.json()),
    fetch("http://localhost:3000/housingLevy").then(res => res.json()),
    fetch("http://localhost:3000/taxBrackets").then(res => res.json()),
    fetch("http://localhost:3000/personalRelief").then(res => res.json()),
    fetch("http://localhost:3000/optionalDeductions").then(res => res.json())
  ]);

  // Statutory deductions
  const nssf = calculateNSSF(nssfData);
  const shif = grossPay * shifData.rate;
  const housing = grossPay * housingData.employeeRate;

  document.getElementById("nssf").value = `KES ${nssf.toFixed(2)}`;
  document.getElementById("shif").value = `KES ${shif.toFixed(2)}`;
  document.getElementById("housingLevy").value = `KES ${housing.toFixed(2)}`;

  // Optional deductions (user input with limits from db.json)
  const deductions = {
    pension: limitInput("pensionContribution", optionalDeductions[0].maxMonthly),
    mortgage: limitInput("mortgageInterest", optionalDeductions[1].maxMonthly),
    life: limitInput("lifeInsurance", optionalDeductions[2].maxMonthly),
    education: limitInput("educationInsurance", optionalDeductions[3].maxMonthly),
    medical: limitInput("medicalInsurance", optionalDeductions[4].maxMonthly),
    postRetirement: limitInput("postRetirementFund", optionalDeductions[5].maxMonthly)
  };

  const allowable = nssf + shif + housing + deductions.pension + deductions.mortgage + deductions.postRetirement;
  const netTaxable = grossPay - allowable;

  const grossPaye = calculatePAYEFromBrackets(netTaxable, taxBrackets);

  const insuranceRelief = 0.15 * (deductions.life + deductions.education + deductions.medical);
  const taxRelief = reliefs.monthlyAmount;
  const netPaye = Math.max(0, grossPaye - taxRelief - insuranceRelief);

  // Display results
  document.getElementById("totalAllowable").textContent = `KES ${allowable.toFixed(2)}`;
  document.getElementById("netTaxable").textContent = `KES ${netTaxable.toFixed(2)}`;
  document.getElementById("grossPaye").textContent = `KES ${grossPaye.toFixed(2)}`;
  document.getElementById("taxRelief").textContent = `KES ${taxRelief.toFixed(2)}`;
  document.getElementById("insuranceRelief").textContent = `KES ${insuranceRelief.toFixed(2)}`;
  document.getElementById("netPaye").textContent = `KES ${netPaye.toFixed(2)}`;
}

function limitInput(id, max) {
  const val = parseFloat(document.getElementById(id).value) || 0;
  return Math.min(val, max);
}

function calculateNSSF(data) {
  let tier1 = Math.min(grossPay, data.tier1.lowerEarningLimit) * data.tier1.rate;
  let tier2 = 0;
  if (grossPay > data.tier1.lowerEarningLimit) {
    tier2 = Math.min(grossPay - data.tier1.lowerEarningLimit, data.tier2.upperEarningLimit - data.tier1.lowerEarningLimit) * data.tier2.rate;
  }
  return Math.min(tier1 + tier2, data.employeeMaxTotal);
}

function calculatePAYEFromBrackets(income, brackets) {
  let tax = 0;
  for (let bracket of brackets) {
    if (income > bracket.min) {
      const upper = bracket.max || income;
      const taxable = Math.min(income, upper) - bracket.min;
      tax += taxable * bracket.rate;
    }
  }
  return tax;
}
