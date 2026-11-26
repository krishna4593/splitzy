import { PageHeader } from '../../../components/PageHeader.jsx'
import { BalanceTable } from '../components/BalanceTable.jsx'
import { useBalances } from '../hooks/useBalances.js'

export function BalancesPage() {
  const { members, totalGroupExpensesPaise } = useBalances()
  const totalPaidPaise = members.reduce((total, member) => total + member.paidPaise, 0)
  const totalSharePaise = members.reduce((total, member) => total + member.sharePaise, 0)

  return (
    <div>
      <PageHeader
        title="Balances"
        description="A transparent breakdown of what each person paid and owes."
      />
      <section className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Group expenses', amount: totalGroupExpensesPaise },
          { label: 'Total paid', amount: totalPaidPaise },
          { label: 'Total member share', amount: totalSharePaise },
        ].map((item) => (
          <article className="rounded-2xl border border-[#E5EAE6] bg-white p-5" key={item.label}>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#87938D]">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-[#142C26]">{formatAmount(item.amount)}</p>
          </article>
        ))}
      </section>
      <BalanceTable balances={members} />
    </div>
  )
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount / 100)
}
