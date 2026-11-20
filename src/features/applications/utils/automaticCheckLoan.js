export function checkLoan(data) {
  const {
    income,
    payment,
    amount,
    months,
    employmentType,
    oldPayments = 0,
  } = data;

  const monthlyIncome = Number(income);
  const monthlyPayment = Number(payment);
  const requestedAmount = Number(amount);
  const termMonths = Number(months);
  const existingPayments = Number(oldPayments);

  if (
    !Number.isFinite(monthlyIncome) ||
    !Number.isFinite(monthlyPayment) ||
    !Number.isFinite(requestedAmount) ||
    !Number.isFinite(termMonths) ||
    !Number.isFinite(existingPayments) ||
    monthlyIncome <= 0 ||
    monthlyPayment <= 0 ||
    requestedAmount <= 0 ||
    termMonths <= 0 ||
    existingPayments < 0
  ) {
    return {
      status: "rejected",
      score: 0,
      reason: "Невалидни или липсващи данни.",
    };
  }

  const validEmploymentTypes = [
    "Трудов договор",
    "Граждански договор",
    "Самоосигуряващо се лице",
    "Безработен",
  ];

  if (!validEmploymentTypes.includes(employmentType)) {
    return {
      status: "rejected",
      score: 0,
      reason: "Невалиден вид заетост.",
    };
  }

  if (termMonths > 60) {
    return {
      status: "rejected",
      score: 0,
      reason: "Максималният срок на кредита е 60 месеца.",
    };
  }

  if (employmentType === "Безработен" && monthlyIncome < 300) {
    return {
      status: "rejected",
      score: 0,
      reason: "Минималният месечен доход за безработни е 300 €.",
    };
  }

  if (employmentType !== "Безработен" && monthlyIncome < 600) {
    return {
      status: "rejected",
      score: 0,
      reason: "Минималният месечен доход е 600 €.",
    };
  }

  let maxAmount = 30000;

  if (employmentType === "Безработен") {
    maxAmount = 500;
  } else if (
    employmentType === "Граждански договор" ||
    employmentType === "Самоосигуряващо се лице"
  ) {
    maxAmount = 3000;
  }

  let incomeLimit = 500;

  if (monthlyIncome >= 600 && monthlyIncome < 800) {
    incomeLimit = 1000;
  } else if (monthlyIncome >= 800 && monthlyIncome < 1000) {
    incomeLimit = 2000;
  } else if (monthlyIncome >= 1000 && monthlyIncome < 1500) {
    incomeLimit = 3000;
  } else if (monthlyIncome >= 1500 && monthlyIncome < 2000) {
    incomeLimit = 5000;
  } else if (monthlyIncome >= 2000 && monthlyIncome < 2500) {
    incomeLimit = 8000;
  } else if (monthlyIncome >= 2500 && monthlyIncome < 3000) {
    incomeLimit = 12000;
  } else if (monthlyIncome >= 3000 && monthlyIncome < 4000) {
    incomeLimit = 18000;
  } else if (monthlyIncome >= 4000 && monthlyIncome < 5000) {
    incomeLimit = 25000;
  } else if (monthlyIncome >= 5000) {
    incomeLimit = 30000;
  }

  const finalLimit =
    employmentType === "Безработен" ? 500 : Math.min(maxAmount, incomeLimit);

  if (requestedAmount > finalLimit) {
    return {
      status: "rejected",
      score: 0,
      reason: `Максималната допустима сума според дохода и заетостта е ${finalLimit} €.`,
    };
  }

  const totalPayment = monthlyPayment + existingPayments;
  const ratio = (totalPayment / monthlyIncome) * 100;

  if (ratio > 35) {
    return {
      status: "rejected",
      score: 0,
      reason: `Общите месечни кредитни вноски са ${ratio.toFixed(2)}% от дохода. Максимумът е 35%.`,
      ratio,
    };
  }

  return {
    status: "approved",
    score: 100,
    reason: "Заявката отговаря на всички условия.",
    ratio,
  };
}
