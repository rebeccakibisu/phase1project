// PAYE Calculator Script Based on Provided db.json

const form = document.getElementById("payeForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const grossPay = Number(document.getElementById("basicSalary").value);

  const [taxBrackets, personalRelief, shifRate, housingLevyRate, nssfRates, optionalDeductions] = await Promise.all([
    fetch("http://localhost:3000/taxBrackets").then(res => res.json()),
    fetch("http://localhost:3000/personalRelief").then(res => res.json()),
    fetch("http://localhost:3000/shif").then(res => res.json()),
    fetch("http://localhost:3000/housingLevy").then(res => res.json()),
    fetch("http://localhost:3000/nssf").then(res => res.json()),
    fetch("http://localhost:3000/optionalDeductions").then(res => res.json())
  ]);

  // CALCULATE STATUTORY DEDUCTIONS
  const nssf = calculateNSSF(grossPay, nssfRates);
  const shif = grossPay * shifRate.rate;
  const housingLevy = grossPay * housingLevyRate.employeeRate;

  document.getElementById("nssf").value = `KES ${nssf.toFixed(2)}`;
  document.getElementById("shif").value = `KES ${shif.toFixed(2)}`;
  document.getElementById("housingLevy").value = `KES ${housingLevy.toFixed(2)}`;

  // GROSS SALARY
  const totalGross = grossPay;

  // ALLOWABLE DEDUCTIONS (statutory + optional)
  let totalAllowable = nssf + shif + housingLevy;
  let insuranceRelief = 0;

  optionalDeductions.forEach(deduction => {
    const id = mapDeductionToId(deduction.name);
    const input = document.getElementById(id);
    if (!input) return;
    const value = Number(input.value) || 0;
    const capped = Math.min(value, deduction.maxMonthly || value);

    // Insurance relief (15%) if applicable
    if (deduction.rate) {
      insuranceRelief += Math.min(capped * deduction.rate, deduction.maxMonthly);
    }

    totalAllowable += capped;
  });

  // NET TAXABLE INCOME
  const netTaxable = totalGross - totalAllowable;

  // CALCULATE GROSS PAYE
  let remainingIncome = netTaxable;
  let grossPaye = 0;
  taxBrackets.forEach(bracket => {
    if (remainingIncome > 0) {
      const upper = bracket.max || remainingIncome + bracket.min;
      const taxable = Math.min(remainingIncome, upper - bracket.min);
      grossPaye += taxable * bracket.rate;
      remainingIncome -= taxable;
    }
  });

  const taxRelief = personalRelief.monthlyAmount;
  const netPaye = Math.max(0, grossPaye - taxRelief - insuranceRelief);

  // POPULATE RESULTS
  document.getElementById("totalGross").textContent = `KES ${totalGross.toFixed(2)}`;
  document.getElementById("totalAllowable").textContent = `KES ${totalAllowable.toFixed(2)}`;
  document.getElementById("netTaxable").textContent = `KES ${netTaxable.toFixed(2)}`;
  document.getElementById("grossPaye").textContent = `KES ${grossPaye.toFixed(2)}`;
  document.getElementById("taxRelief").textContent = `KES ${taxRelief.toFixed(2)}`;
  document.getElementById("insuranceRelief").textContent = `KES ${insuranceRelief.toFixed(2)}`;
  document.getElementById("netPaye").textContent = `KES ${netPaye.toFixed(2)}`;
});

function calculateNSSF(gross, nssfData) {
  const tier1Limit = nssfData.tier1.lowerEarningLimit;
  const tier2Limit = nssfData.tier2.upperEarningLimit;
  const tier1Rate = nssfData.tier1.rate;
  const tier2Rate = nssfData.tier2.rate;
  const maxTotal = nssfData.employeeMaxTotal;

  const tier1 = Math.min(gross, tier1Limit) * tier1Rate;
  let tier2 = 0;
  if (gross > tier1Limit) {
    tier2 = Math.min(gross - tier1Limit, tier2Limit - tier1Limit) * tier2Rate;
  }
  return Math.min(tier1 + tier2, maxTotal);
}

function mapDeductionToId(name) {
  const map = {
    "Pension Contribution": "pensionContribution",
    "Mortgage Interest": "mortgageInterest",
    "Life Insurance Premium": "lifeInsurance",
    "Education Policy Premium": "educationInsurance",
    "Medical Insurance Premium": "medicalInsurance",
    "Post-Retirement Medical Fund": "postRetirementFund"
  };
  return map[name];
}
