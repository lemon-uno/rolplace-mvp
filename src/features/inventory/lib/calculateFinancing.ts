export function calculateMonthlyPayment(
  price: number,
  annualRate: number,
  termMonths: number,
  downPaymentPct: number,
): { monthly: number; downPayment: number; totalPayment: number; interestTotal: number } {
  const downPayment = price * (downPaymentPct / 100)
  const principal = price - downPayment
  const monthlyRate = annualRate / 100 / 12

  let monthly: number
  if (monthlyRate === 0) {
    monthly = principal / termMonths
  } else {
    monthly = principal * ((monthlyRate * (1 + monthlyRate) ** termMonths) / ((1 + monthlyRate) ** termMonths - 1))
  }

  const totalPayment = monthly * termMonths + downPayment
  const interestTotal = monthly * termMonths - principal

  return { monthly, downPayment, totalPayment, interestTotal }
}
