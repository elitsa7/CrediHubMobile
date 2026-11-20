export function generateInstallments(principal, annualRate, months) {
  const amount = Number(principal);
  const rate = Number(annualRate);
  const term = Number(months);

  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(rate) ||
    !Number.isInteger(term) ||
    amount <= 0 ||
    rate < 0 ||
    term <= 0 ||
    term > 60
  ) {
    throw new Error("Невалидни данни за погасителния план.");
  }

  const roundMoney = (value) =>
    Math.round((value + Number.EPSILON) * 100) / 100;

  const monthlyRate = rate / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? amount / term
      : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

  let remainingBalance = roundMoney(amount);

  const installments = [];
  const startDate = new Date();

  for (let i = 1; i <= term; i++) {
    const interest = roundMoney(remainingBalance * monthlyRate);

    let principalPayment = roundMoney(monthlyPayment - interest);

    if (i === term || principalPayment > remainingBalance) {
      principalPayment = remainingBalance;
    }

    const totalAmount = roundMoney(principalPayment + interest);

    remainingBalance = roundMoney(remainingBalance - principalPayment);

    const targetMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + i,
      1,
    );

    const lastDay = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth() + 1,
      0,
    ).getDate();

    const dueDate = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      Math.min(startDate.getDate(), lastDay),
    );

    const formattedDate = [
      dueDate.getFullYear(),
      String(dueDate.getMonth() + 1).padStart(2, "0"),
      String(dueDate.getDate()).padStart(2, "0"),
    ].join("-");

    installments.push({
      installment_number: i,
      due_date: formattedDate,
      principal_amount: principalPayment,
      interest_amount: interest,
      total_amount: totalAmount,
      paid_amount: 0,
      status: "pending",
    });
  }

  return installments;
}
