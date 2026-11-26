import { useGroup } from '../../../app/useGroup.js'

export function useExpenses() {
  const { group, addGroupExpense, deleteGroupExpense } = useGroup()
  return {
    expenses: [...group.expenses].sort((left, right) => right.date.localeCompare(left.date)),
    members: group.members,
    addExpense: addGroupExpense,
    deleteExpense: deleteGroupExpense,
  }
}
