import { splitAmountEqually } from './moneyService.js'

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `expense-${Date.now()}-${Math.random()}`
}

export function addExpense(group, expenseInput) {
  const title = expenseInput.title.trim()
  if (!title) throw new Error('Enter an expense title.')
  if (!Number.isSafeInteger(expenseInput.amountPaise) || expenseInput.amountPaise <= 0) {
    throw new Error('Enter a positive amount with up to two decimal places.')
  }

  const payerExists = group.members.some((member) => member.id === expenseInput.paidById)
  if (!payerExists) throw new Error('Choose who paid for this expense.')

  const participantIds = [...new Set(expenseInput.participantIds)]
  if (
    participantIds.length === 0 ||
    participantIds.some((id) => !group.members.some((member) => member.id === id))
  ) {
    throw new Error('Select at least one group member to split this expense.')
  }

  const expense = {
    id: createId(),
    title,
    amountPaise: expenseInput.amountPaise,
    paidById: expenseInput.paidById,
    participantIds,
    date: new Date().toISOString(),
  }

  return { ...group, expenses: [...group.expenses, expense] }
}

export function deleteExpense(group, expenseId) {
  return {
    ...group,
    expenses: group.expenses.filter((expense) => expense.id !== expenseId),
  }
}

export function getExpenseShares(expense) {
  return splitAmountEqually(expense.amountPaise, expense.participantIds.length)
}
