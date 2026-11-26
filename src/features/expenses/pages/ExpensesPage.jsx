import { PageHeader } from '../../../components/PageHeader.jsx'
import { ExpenseForm } from '../components/ExpenseForm.jsx'
import { ExpenseList } from '../components/ExpenseList.jsx'
import { useExpenses } from '../hooks/useExpenses.js'

export function ExpensesPage() {
  const { expenses, members, addExpense, deleteExpense } = useExpenses()

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Add shared costs and keep the group ledger up to date."
      />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.4fr)]">
        <ExpenseForm members={members} onAddExpense={addExpense} />
        <ExpenseList expenses={expenses} members={members} onDelete={deleteExpense} />
      </div>
    </div>
  )
}
