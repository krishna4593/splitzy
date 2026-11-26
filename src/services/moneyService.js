const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function parseRupeesToPaise(value) {
  const normalizedValue = String(value).trim()
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedValue)) return null

  const [rupees, paise = ''] = normalizedValue.split('.')
  const amountPaise = Number(rupees) * 100 + Number(paise.padEnd(2, '0'))

  return Number.isSafeInteger(amountPaise) && amountPaise > 0
    ? amountPaise
    : null
}

export function formatPaise(amountPaise) {
  return inrFormatter.format(amountPaise / 100)
}

export function splitAmountEqually(amountPaise, participantCount) {
  if (participantCount < 1) return []

  const baseShare = Math.floor(amountPaise / participantCount)
  const remainder = amountPaise % participantCount

  return Array.from(
    { length: participantCount },
    (_, index) => baseShare + (index < remainder ? 1 : 0),
  )
}
