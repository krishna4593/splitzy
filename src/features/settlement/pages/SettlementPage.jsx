import { Link } from 'react-router-dom'
import { PageHeader } from '../../../components/PageHeader.jsx'
import { BalanceTable } from '../../balances/components/BalanceTable.jsx'
import { useBalances } from '../../balances/hooks/useBalances.js'
import { SettlementList } from '../components/SettlementList.jsx'
import { useSettlement } from '../hooks/useSettlement.js'

export function SettlementPage() {
  const { members } = useBalances()
  const transactions = useSettlement()

  return (
    <div>
      <PageHeader
        title="Settle up"
        description="The fewest payments needed to bring every group balance to zero."
      />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <SettlementList transactions={transactions} />
        <BalanceTable balances={members} compact />
      </div>
      {transactions.length > 0 && (
        <div className="mt-5 rounded-xl border border-[#E5EAE6] bg-white px-5 py-4 text-sm text-[#718078]">
          Once payments are made, record them as a new expense or update your group outside Splitzy.{' '}
          <Link className="font-medium text-[#16834B] hover:underline" to="/expenses">Go to expenses</Link>
        </div>
      )}
    </div>
  )
}
