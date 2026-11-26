import { useState } from 'react'
import { CalendarDays, CircleAlert, ReceiptText, Trash2 } from 'lucide-react'
import { formatPaise } from '../../../services/moneyService.js'
import { getExpenseShares } from '../../../services/expenseService.js'

function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function ExpenseList({ expenses, members, onDelete }) {
  const [deleteError, setDeleteError] = useState('')
  const memberById = new Map(members.map((member) => [member.id, member]))

  function remove(expenseId) {
    setDeleteError('')
    try {
      onDelete(expenseId)
    } catch (error) {
      setDeleteError(error.message)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5EAE6] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#F0F2F0] px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-[#142C26]">Expense history</h2>
          <p className="mt-0.5 text-xs text-[#87938D]">{expenses.length} recorded</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4F6F4] text-[#718078]">
          <ReceiptText size={17} />
        </span>
      </div>
      {deleteError && <p className="mx-5 mt-4 flex items-center gap-2 text-sm text-[#B84F3E]" role="alert"><CircleAlert size={15} />{deleteError}</p>}
      {expenses.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4F6F4] text-[#87938D]">
            <ReceiptText size={20} />
          </span>
          <p className="mt-4 text-sm font-medium text-[#425148]">No expenses yet</p>
          <p className="mt-1 text-sm text-[#87938D]">Add a shared expense to see it here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#F0F2F0]">
          {expenses.map((expense, index) => {
            const payer = memberById.get(expense.paidById)
            const shares = getExpenseShares(expense)
            const participantNames = expense.participantIds
              .map((id) => memberById.get(id)?.name)
              .filter(Boolean)

            return (
              <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6" key={expense.id}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  index % 3 === 0 ? 'bg-[#EAF4EF] text-[#16834B]' : index % 3 === 1 ? 'bg-[#EAF0FB] text-[#5674A2]' : 'bg-[#F8EFE8] text-[#A66B47]'
                }`}>
                  <ReceiptText size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="truncate text-sm font-semibold text-[#263B31]">{expense.title}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-[#87938D]">
                      <CalendarDays size={12} />
                      {formatDate(expense.date)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#718078]">
                    <span>Paid by {payer?.name ?? 'Unknown member'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{participantNames.join(', ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {shares.length > 0 ? `${formatPaise(shares[0])} each` : 'No split'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="text-sm font-semibold tabular-nums text-[#142C26]">
                    {formatPaise(expense.amountPaise)}
                  </p>
                  <button
                    aria-label={`Delete ${expense.title}`}
                    className="rounded-lg p-2 text-[#9BA69F] transition hover:bg-[#FFF1EC] hover:text-[#B84F3E]"
                    onClick={() => remove(expense.id)}
                    title="Delete expense"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
