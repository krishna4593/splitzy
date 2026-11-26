import { useState } from 'react'
import { CircleAlert, ReceiptText } from 'lucide-react'
import { parseRupeesToPaise } from '../../../services/moneyService.js'

export function ExpenseForm({ members, onAddExpense }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidById, setPaidById] = useState(members[0]?.id ?? '')
  const [participantIds, setParticipantIds] = useState(members.map((member) => member.id))
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  function toggleParticipant(memberId) {
    setParticipantIds((currentIds) =>
      currentIds.includes(memberId)
        ? currentIds.filter((id) => id !== memberId)
        : [...currentIds, memberId],
    )
    setErrors((currentErrors) => ({ ...currentErrors, participants: '' }))
    setSaved(false)
  }

  function submit(event) {
    event.preventDefault()
    setSaved(false)

    const nextErrors = {}
    const amountPaise = parseRupeesToPaise(amount)

    if (!title.trim()) nextErrors.title = 'Enter an expense title.'
    if (amount === '' || amountPaise === null) {
      nextErrors.amount = 'Enter a positive amount with up to two decimal places.'
    }
    if (!members.some((member) => member.id === paidById)) {
      nextErrors.payer = 'Choose who paid for this expense.'
    }
    if (participantIds.length === 0) {
      nextErrors.participants = 'Select at least one member to split this expense.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      onAddExpense({ title, amountPaise, paidById, participantIds })
      setTitle('')
      setAmount('')
      setParticipantIds(members.map((member) => member.id))
      setSaved(true)
    } catch (error) {
      setErrors({ form: error.message })
    }
  }

  const selectedCount = participantIds.length

  return (
    <section className="rounded-2xl border border-[#E5EAE6] bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4EF] text-[#16834B]">
          <ReceiptText size={19} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[#142C26]">Add an expense</h2>
          <p className="mt-1 text-sm text-[#87938D]">Split a shared cost with your group.</p>
        </div>
      </div>
      {members.length < 2 ? (
        <p className="rounded-xl bg-[#F7F8F6] px-4 py-3 text-sm text-[#718078]">
          Add at least two members before recording an expense.
        </p>
      ) : (
        <form className="space-y-5" noValidate onSubmit={submit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#425148]" htmlFor="expense-title">
                Expense title
              </label>
              <input
                aria-describedby={errors.title ? 'expense-title-error' : undefined}
                aria-invalid={Boolean(errors.title)}
                className="w-full rounded-lg border border-[#DDE5DF] px-3.5 py-2.5 text-sm outline-none focus:border-[#16834B] focus:ring-4 focus:ring-[#16834B]/10"
                id="expense-title"
                maxLength={80}
                onChange={(event) => {
                  setTitle(event.target.value)
                  setErrors((currentErrors) => ({ ...currentErrors, title: '', form: '' }))
                  setSaved(false)
                }}
                placeholder="e.g. Dinner, cab, groceries"
                value={title}
              />
              {errors.title && <p className="mt-1.5 text-xs text-[#B84F3E]" id="expense-title-error">{errors.title}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#425148]" htmlFor="expense-amount">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#87938D]">₹</span>
                <input
                  aria-describedby={errors.amount ? 'expense-amount-error' : undefined}
                  aria-invalid={Boolean(errors.amount)}
                  className="w-full rounded-lg border border-[#DDE5DF] py-2.5 pl-8 pr-3.5 text-sm tabular-nums outline-none focus:border-[#16834B] focus:ring-4 focus:ring-[#16834B]/10"
                  id="expense-amount"
                  inputMode="decimal"
                  onChange={(event) => {
                    setAmount(event.target.value)
                    setErrors((currentErrors) => ({ ...currentErrors, amount: '', form: '' }))
                    setSaved(false)
                  }}
                  placeholder="0.00"
                  value={amount}
                />
              </div>
              {errors.amount && <p className="mt-1.5 text-xs text-[#B84F3E]" id="expense-amount-error">{errors.amount}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#425148]" htmlFor="expense-payer">
              Paid by
            </label>
            <select
              aria-describedby={errors.payer ? 'expense-payer-error' : undefined}
              aria-invalid={Boolean(errors.payer)}
              className="w-full rounded-lg border border-[#DDE5DF] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#16834B] focus:ring-4 focus:ring-[#16834B]/10"
              id="expense-payer"
              onChange={(event) => {
                setPaidById(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, payer: '', form: '' }))
                setSaved(false)
              }}
              value={paidById}
            >
              <option value="">Select a member</option>
              {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
            {errors.payer && <p className="mt-1.5 text-xs text-[#B84F3E]" id="expense-payer-error">{errors.payer}</p>}
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-[#425148]">Split equally among</legend>
            <p className="mt-1 text-xs text-[#87938D]">Any leftover paise are shared one by one in the order selected.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {members.map((member) => {
                const checked = participantIds.includes(member.id)
                return (
                  <label
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                      checked
                        ? 'border-[#16834B] bg-[#EAF4EF] text-[#16834B]'
                        : 'border-[#DDE5DF] bg-white text-[#5F6C64] hover:bg-[#F7F8F6]'
                    }`}
                    key={member.id}
                  >
                    <input
                      checked={checked}
                      className="accent-[#16834B]"
                      onChange={() => toggleParticipant(member.id)}
                      type="checkbox"
                    />
                    {member.name}
                  </label>
                )
              })}
            </div>
            {errors.participants && <p className="mt-1.5 text-xs text-[#B84F3E]">{errors.participants}</p>}
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F2F0] pt-5">
            <p className="text-xs text-[#87938D]">
              {selectedCount ? `Each member shares an equal part across ${selectedCount} ${selectedCount === 1 ? 'person' : 'people'}.` : 'Choose who will share this expense.'}
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-[#16834B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#126C3E]"
              type="submit"
            >
              <ReceiptText size={16} />
              Add expense
            </button>
          </div>
          {errors.form && (
            <p className="flex items-center gap-2 rounded-lg bg-[#FFF4F0] px-3 py-2.5 text-sm text-[#A84938]" role="alert">
              <CircleAlert size={16} />
              {errors.form}
            </p>
          )}
          {saved && <p className="text-sm font-medium text-[#16834B]" role="status">Expense added successfully.</p>}
        </form>
      )}
    </section>
  )
}
