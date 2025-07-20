document.addEventListener("DOMContentLoaded", () => {
  const incomeInputs = [
    "basicSalary",
    "houseAllowance",
    "transportAllowance",
    "entertainmentAllowance",
    "overtimePay",
    "bonus",
    "otherAllowances"
  ];

  let grossPay = 0;

  function updateGrossPreview() {
    grossPay = incomeInputs.reduce((sum, id) => {
      const val = parseFloat(document.getElementById(id).value) || 0;
      return sum + val;
    }, 0);

    document.getElementById("grossPreview").textContent = `KES ${grossPay.toFixed(2)}`;
    document.getElementById("totalGross").textContent = `KES ${grossPay.toFixed(2)}`;

    updateStatutoryDeductions();
  }

  function updateStatutoryDeductions() {
    const nssf = Math.min(grossPay * 0.06 * 2, 4320);
    const shif = grossPay * 0.0275;
    const housingLevy = grossPay * 0.015;

    document.getElementById("nssf").value = `KES ${nssf.toFixed(2)}`;
    document.getElementById("shif").value = `KES ${shif.toFixed(2)}`;
    document.getElementById("housingLevy").value = `KES ${housingLevy.toFixed(2)}`;
  }

  incomeInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", updateGrossPreview);
  });

  document.getElementById("payeForm").addEventListener("submit", event => {
    event.preventDefault();

    const nssf = Math.min(grossPay * 0.06 * 2, 4320);
    const shif = grossPay * 0.0275;
    const housingLevy = grossPay * 0.015;

    const pension = parseFloat(document.getElementById("pensionContribution").value) || 0;
    const mortgage = parseFloat(document.getElementById("mortgageInterest").value) || 0;
    const life = parseFloat(document.getElementById("lifeInsurance").value) || 0;
    const edu = parseFloat(document.getElementById("educationInsurance").value) || 0;
    const medical = parseFloat(document.getElementById("medicalInsurance").value) || 0;
    const postRetirement = parseFloat(document.getElementById("postRetirementFund").value) || 0;

    const insuranceRelief = Math.min(life * 0.15, 750) + Math.min(edu * 0.15, 750) + Math.min(medical * 0.15, 750);
    const personalRelief = 2400;

    const totalAllowable = nssf + shif + housingLevy + pension + mortgage + postRetirement;
    const netTaxable = grossPay - totalAllowable;

    const taxBrackets = [
      { min: 0, max: 24000, rate: 0.1 },
      { min: 24001, max: 32333, rate: 0.25 },
      { min: 32334, max: 500000, rate: 0.30 },
      { min: 500001, max: 800000, rate: 0.325 },
      { min: 800001, max: Infinity, rate: 0.35 }
    ];

    let grossPaye = 0;
    let remaining = netTaxable;

    for (let bracket of taxBrackets) {
      if (remaining > 0 && netTaxable > bracket.min) {
        const range = Math.min(bracket.max - bracket.min, remaining);
        grossPaye += range * bracket.rate;
        remaining -= range;
      }
    }

    let netPaye = grossPaye - personalRelief - insuranceRelief;
    if (netPaye < 0) netPaye = 0;

    // Display results
    document.getElementById("totalAllowable").textContent = `KES ${totalAllowable.toFixed(2)}`;
    document.getElementById("netTaxable").textContent = `KES ${netTaxable.toFixed(2)}`;
    document.getElementById("grossPaye").textContent = `KES ${grossPaye.toFixed(2)}`;
    document.getElementById("taxRelief").textContent = `KES ${personalRelief.toFixed(2)}`;
    document.getElementById("insuranceRelief").textContent = `KES ${insuranceRelief.toFixed(2)}`;
    document.getElementById("netPaye").textContent = `KES ${netPaye.toFixed(2)}`;
  });
});
