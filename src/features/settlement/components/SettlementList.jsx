import { ArrowRight, Check, HandCoins } from 'lucide-react'
import { Avatar } from '../../../components/Avatar.jsx'
import { formatPaise } from '../../../services/moneyService.js'

export function SettlementList({ transactions }) {
  return (
    <section className="rounded-2xl border border-[#E5EAE6] bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4EF] text-[#16834B]">
          <HandCoins size={19} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[#142C26]">Simplified settle up</h2>
          <p className="mt-1 text-sm text-[#87938D]">
            {transactions.length
              ? `${transactions.length} ${transactions.length === 1 ? 'payment' : 'payments'} will settle all balances.`
              : 'Everyone is settled up.'}
          </p>
        </div>
      </div>
      {transactions.length === 0 ? (
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#F5F8F5] px-4 py-4 text-sm text-[#526158]">
          <Check className="text-[#16834B]" size={18} />
          No payments are needed right now.
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {transactions.map(({ from, to, amountPaise }) => (
            <li
              className="flex flex-wrap items-center gap-3 rounded-xl border border-[#EDF1EE] bg-[#FBFCFB] px-4 py-3"
              key={`${from.id}-${to.id}`}
            >
              <Avatar name={from.name} size="sm" tone="peach" />
              <span className="min-w-0 flex-1 text-sm text-[#425148]">
                <strong className="font-semibold text-[#263B31]">{from.name}</strong>
                <span className="mx-2 text-[#A6B0AA]">pays</span>
                <strong className="font-semibold text-[#263B31]">{to.name}</strong>
              </span>
              <ArrowRight className="hidden text-[#A6B0AA] sm:block" size={15} />
              <span className="text-sm font-semibold tabular-nums text-[#142C26]">
                {formatPaise(amountPaise)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
