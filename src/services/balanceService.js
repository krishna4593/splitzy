import { splitAmountEqually } from './moneyService.js'

export function calculateBalances(group) {
  const totalsByMember = new Map(
    group.members.map((member) => [
      member.id,
      { member, paidPaise: 0, sharePaise: 0, netPaise: 0 },
    ]),
  )

  for (const expense of group.expenses) {
    const payer = totalsByMember.get(expense.paidById)
    if (payer) payer.paidPaise += expense.amountPaise

    const shares = splitAmountEqually(
      expense.amountPaise,
      expense.participantIds.length,
    )
    expense.participantIds.forEach((memberId, index) => {
      const participant = totalsByMember.get(memberId)
      if (participant) participant.sharePaise += shares[index]
    })
  }

  const members = [...totalsByMember.values()].map((balance) => ({
    ...balance,
    netPaise: balance.paidPaise - balance.sharePaise,
  }))

  return {
    members,
    totalGroupExpensesPaise: group.expenses.reduce(
      (total, expense) => total + expense.amountPaise,
      0,
    ),
    totalNetPaise: members.reduce((total, balance) => total + balance.netPaise, 0),
  }
}
