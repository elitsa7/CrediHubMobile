export function calculateLoan(amount, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    const monthlyPayment = amount / months;

    return {
      monthlyPayment,
      totalPayment: amount,
      totalInterest: 0,
    };
  }
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - amount;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
  };
}
