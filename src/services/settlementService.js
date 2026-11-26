export function calculateSettlements(balanceRows) {
  const balances = balanceRows
    .filter((row) => row.netPaise !== 0)
    .map((row) => ({ member: row.member, netPaise: row.netPaise }))

  const totalNetPaise = balances.reduce((total, balance) => total + balance.netPaise, 0)
  if (totalNetPaise !== 0) {
    throw new Error('Cannot create settlements because group balances do not net to zero.')
  }

  const count = balances.length
  if (count < 2) return []

  const subsetCount = 1 << count
  const subsetSums = new Array(subsetCount).fill(0)
  for (let mask = 1; mask < subsetCount; mask += 1) {
    const bit = mask & -mask
    const index = 31 - Math.clz32(bit)
    subsetSums[mask] = subsetSums[mask ^ bit] + balances[index].netPaise
  }

  const memo = new Array(subsetCount).fill(-1)
  const choice = new Array(subsetCount).fill(0)
  memo[0] = 0

  function maxZeroSumGroups(mask) {
    if (memo[mask] !== -1) return memo[mask]

    const anchor = mask & -mask
    let bestCount = -1

    for (let subset = mask; subset > 0; subset = (subset - 1) & mask) {
      if ((subset & anchor) === 0 || subsetSums[subset] !== 0) continue

      const groupCount = 1 + maxZeroSumGroups(mask ^ subset)
      if (groupCount > bestCount) {
        bestCount = groupCount
        choice[mask] = subset
      }
    }

    memo[mask] = bestCount
    return bestCount
  }

  const fullMask = subsetCount - 1
  maxZeroSumGroups(fullMask)

  const groups = []
  for (let remaining = fullMask; remaining > 0; ) {
    const groupMask = choice[remaining]
    if (groupMask === 0) {
      throw new Error('Could not find a valid zero-sum settlement.')
    }

    groups.push(
      balances.filter((_, index) => (groupMask & (1 << index)) !== 0),
    )
    remaining ^= groupMask
  }

  return groups.flatMap((group) => settleZeroSumGroup(group))
}

function settleZeroSumGroup(group) {
  const debtors = group
    .filter((row) => row.netPaise < 0)
    .map((row) => ({ member: row.member, remainingPaise: -row.netPaise }))
    .sort((left, right) => right.remainingPaise - left.remainingPaise)
  const creditors = group
    .filter((row) => row.netPaise > 0)
    .map((row) => ({ member: row.member, remainingPaise: row.netPaise }))
    .sort((left, right) => right.remainingPaise - left.remainingPaise)

  const transactions = []
  let debtorIndex = 0
  let creditorIndex = 0

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    const amountPaise = Math.min(debtor.remainingPaise, creditor.remainingPaise)

    transactions.push({
      from: debtor.member,
      to: creditor.member,
      amountPaise,
    })

    debtor.remainingPaise -= amountPaise
    creditor.remainingPaise -= amountPaise
    if (debtor.remainingPaise === 0) debtorIndex += 1
    if (creditor.remainingPaise === 0) creditorIndex += 1
  }

  return transactions
}
