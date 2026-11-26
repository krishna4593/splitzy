import { Link } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText, WalletCards } from 'lucide-react'
import { Avatar } from '../../../components/Avatar.jsx'
import { PageHeader } from '../../../components/PageHeader.jsx'
import { useGroup } from '../../../app/useGroup.js'
import { formatPaise } from '../../../services/moneyService.js'
import { useBalances } from '../../balances/hooks/useBalances.js'
import { BalanceTable } from '../../balances/components/BalanceTable.jsx'
import { useExpenses } from '../../expenses/hooks/useExpenses.js'
import { ExpenseList } from '../../expenses/components/ExpenseList.jsx'
import { useSettlement } from '../../settlement/hooks/useSettlement.js'
import { SettlementList } from '../../settlement/components/SettlementList.jsx'

const avatarTones = ['green', 'blue', 'peach', 'purple']

function SummaryCard({ label, amount, description, tone, icon: Icon }) {
  const styles = {
    neutral: {
      icon: 'bg-[#F1F4F2] text-[#526158]',
      amount: 'text-[#142C26]',
    },
    positive: {
      icon: 'bg-[#EAF4EF] text-[#16834B]',
      amount: 'text-[#16834B]',
    },
    negative: {
      icon: 'bg-[#FFF1EC] text-[#C45C45]',
      amount: 'text-[#C45C45]',
    },
  }

  return (
    <article className="rounded-2xl border border-[#E5EAE6] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#87938D]">{label}</p>
          <p className={`mt-4 text-[27px] font-semibold tracking-tight tabular-nums sm:text-[30px] ${styles[tone].amount}`}>
            {formatPaise(amount)}
          </p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[tone].icon}`}>
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-3 text-xs text-[#87938D]">{description}</p>
    </article>
  )
}

export function OverviewPage() {
  const { group } = useGroup()
  const { members: balances, totalGroupExpensesPaise } = useBalances()
  const { expenses, members, deleteExpense } = useExpenses()
  const settlements = useSettlement()
  const currentMember =
    members.find((member) => member.id === group.settings.currentMemberId) ?? members[0]
  const currentBalance = balances.find((row) => row.member.id === currentMember?.id)
  const amountOwedPaise = Math.max(0, -(currentBalance?.netPaise ?? 0))
  const amountToReceivePaise = Math.max(0, currentBalance?.netPaise ?? 0)

  return (
    <div>
      <PageHeader
        title={`Good morning, ${currentMember?.name ?? 'there'}`}
        description="Here's what's happening with your group expenses."
        action={
          <Link
            className="inline-flex items-center gap-2 rounded-lg bg-[#16834B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#126C3E]"
            to="/expenses"
          >
            <Plus size={17} />
            Add expense
          </Link>
        }
      />

      <section aria-label="Group summary" className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          amount={totalGroupExpensesPaise}
          description={`${expenses.length} ${expenses.length === 1 ? 'expense' : 'expenses'} in ${group.settings.groupName}`}
          icon={WalletCards}
          label="Total group expenses"
          tone="neutral"
        />
        <SummaryCard
          amount={amountOwedPaise}
          description={amountOwedPaise ? 'Your share still to settle' : 'You have nothing to pay'}
          icon={ArrowUpRight}
          label="You owe"
          tone={amountOwedPaise ? 'negative' : 'neutral'}
        />
        <SummaryCard
          amount={amountToReceivePaise}
          description={amountToReceivePaise ? 'Coming back to you' : 'No payments due to you'}
          icon={ArrowDownLeft}
          label="You get back"
          tone={amountToReceivePaise ? 'positive' : 'neutral'}
        />
      </section>

      <section className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.9fr)]">
        <div className="space-y-5">
          <ExpenseList
            expenses={expenses.slice(0, 5)}
            members={members}
            onDelete={deleteExpense}
          />
          <BalanceTable balances={balances} compact />
        </div>
        <div className="space-y-5">
          <section className="rounded-2xl border border-[#E5EAE6] bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#142C26]">Group members</h2>
                <p className="mt-0.5 text-xs text-[#87938D]">{members.length} active</p>
              </div>
              <Link className="text-sm font-medium text-[#16834B] hover:text-[#126C3E]" to="/members">
                Manage
              </Link>
            </div>
            {members.length === 0 ? (
              <div className="rounded-xl bg-[#F7F8F6] px-4 py-5 text-sm text-[#718078]">
                Add at least two people to start splitting.
              </div>
            ) : (
              <ul className="space-y-2.5">
                {members.map((member, index) => {
                  const balance = balances.find((row) => row.member.id === member.id)
                  const net = balance?.netPaise ?? 0
                  return (
                    <li className="flex items-center gap-3 rounded-xl bg-[#FBFCFB] px-3 py-3" key={member.id}>
                      <Avatar name={member.name} tone={avatarTones[index % avatarTones.length]} size="sm" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#425148]">{member.name}</span>
                      <span className={`text-sm font-semibold tabular-nums ${
                        net > 0 ? 'text-[#16834B]' : net < 0 ? 'text-[#C45C45]' : 'text-[#87938D]'
                      }`}>
                        {net > 0 ? '+' : ''}{formatPaise(net)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
            {members.length < 10 && (
              <Link
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#16834B] hover:text-[#126C3E]"
                to="/members"
              >
                <Plus size={16} />
                Add a member
              </Link>
            )}
          </section>
          <SettlementList transactions={settlements} />
          {expenses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#DDE5DF] p-5 text-center">
              <ReceiptText className="mx-auto text-[#A6B0AA]" size={20} />
              <p className="mt-2 text-sm text-[#718078]">Your next shared expense can start here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
