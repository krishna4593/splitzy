import { useState } from 'react'
import { CircleAlert, Plus, Trash2, UsersRound } from 'lucide-react'
import { Avatar } from '../../../components/Avatar.jsx'
import { PageHeader } from '../../../components/PageHeader.jsx'
import { formatPaise } from '../../../services/moneyService.js'
import { useBalances } from '../../balances/hooks/useBalances.js'
import { useMembers } from '../hooks/useMembers.js'

const avatarTones = ['green', 'blue', 'peach', 'purple']

export function MemberManagement() {
  const { members, add, remove, error, clearError } = useMembers()
  const { members: balances } = useBalances()
  const [name, setName] = useState('')

  function submit(event) {
    event.preventDefault()
    if (add(name)) setName('')
  }

  return (
    <div>
      <PageHeader
        title="Group members"
        description="Manage who's sharing expenses with your group."
      />
      <section className="rounded-2xl border border-[#E5EAE6] bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#142C26]">Your people</h2>
            <p className="mt-1 text-sm text-[#87938D]">
              {members.length} of 10 members
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4EF] text-[#16834B]">
            <UsersRound size={19} />
          </span>
        </div>
        <form className="mb-6 flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
          <label className="sr-only" htmlFor="member-name">Member name</label>
          <input
            autoComplete="off"
            className="min-w-0 flex-1 rounded-lg border border-[#DDE5DF] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#16834B] focus:ring-4 focus:ring-[#16834B]/10"
            id="member-name"
            maxLength={50}
            onChange={(event) => {
              setName(event.target.value)
              if (error) clearError()
            }}
            placeholder="Add a member by name"
            value={name}
          />
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16834B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#126C3E] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={members.length >= 10}
            type="submit"
          >
            <Plus size={17} />
            Add member
          </button>
        </form>
        {error && (
          <p className="mb-4 flex items-center gap-2 rounded-lg bg-[#FFF4F0] px-3 py-2.5 text-sm text-[#A84938]" role="alert">
            <CircleAlert size={16} />
            {error}
          </p>
        )}
        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#DDE5DF] py-12 text-center">
            <UsersRound className="mx-auto text-[#A6B0AA]" size={24} />
            <p className="mt-3 text-sm font-medium text-[#425148]">Start with your group</p>
            <p className="mt-1 text-sm text-[#87938D]">Add at least two people to begin splitting.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0F2F0]">
            {members.map((member, index) => {
              const balance = balances.find((row) => row.member.id === member.id)
              const hasExpenses = balance?.paidPaise > 0 || balance?.sharePaise > 0

              return (
                <div className="flex flex-wrap items-center gap-3 py-4 first:pt-1" key={member.id}>
                  <Avatar name={member.name} tone={avatarTones[index % avatarTones.length]} />
                  <div className="min-w-28 flex-1">
                    <p className="text-sm font-semibold text-[#263B31]">{member.name}</p>
                    <p className="mt-0.5 text-xs text-[#87938D]">
                      {hasExpenses ? `Paid ${formatPaise(balance.paidPaise)}` : 'No expenses yet'}
                    </p>
                  </div>
                  <p className={`mr-2 text-sm font-semibold tabular-nums ${
                    (balance?.netPaise ?? 0) > 0
                      ? 'text-[#16834B]'
                      : (balance?.netPaise ?? 0) < 0
                        ? 'text-[#C45C45]'
                        : 'text-[#718078]'
                  }`}>
                    {(balance?.netPaise ?? 0) > 0 ? '+' : ''}
                    {formatPaise(balance?.netPaise ?? 0)}
                  </p>
                  <button
                    aria-label={`Remove ${member.name}`}
                    className="rounded-lg p-2 text-[#9BA69F] transition hover:bg-[#FFF1EC] hover:text-[#B84F3E]"
                    onClick={() => remove(member.id)}
                    title={hasExpenses ? 'This member has expenses' : 'Remove member'}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
