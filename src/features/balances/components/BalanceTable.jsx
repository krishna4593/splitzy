import { CheckCircle2, WalletCards } from 'lucide-react'
import { Avatar } from '../../../components/Avatar.jsx'
import { formatPaise } from '../../../services/moneyService.js'

export function BalanceTable({ balances, compact = false }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5EAE6] bg-white">
      <div className="flex items-center justify-between border-b border-[#F0F2F0] px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-[#142C26]">Balance breakdown</h2>
          <p className="mt-0.5 text-xs text-[#87938D]">What everyone paid and their share</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4F6F4] text-[#718078]">
          <WalletCards size={17} />
        </span>
      </div>
      {balances.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-[#87938D]">Add group members to see the balance breakdown.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-[#FBFCFB] text-xs font-medium text-[#87938D]">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Member</th>
                  <th className="px-4 py-3 text-right">Total paid</th>
                  <th className="px-4 py-3 text-right">Total share</th>
                  <th className="px-5 py-3 text-right sm:px-6">Net balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F2F0]">
                {balances.map(({ member, paidPaise, sharePaise, netPaise }) => (
                  <tr className="text-sm" key={member.id}>
                    <td className="px-5 py-3.5 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={member.name} size="sm" />
                        <span className="font-medium text-[#425148]">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-[#425148]">{formatPaise(paidPaise)}</td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-[#718078]">{formatPaise(sharePaise)}</td>
                    <td className={`px-5 py-3.5 text-right font-semibold tabular-nums sm:px-6 ${
                      netPaise > 0 ? 'text-[#16834B]' : netPaise < 0 ? 'text-[#C45C45]' : 'text-[#718078]'
                    }`}>
                      {netPaise > 0 ? '+' : ''}{formatPaise(netPaise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!compact && (
            <div className="flex items-center gap-2 border-t border-[#F0F2F0] bg-[#FBFCFB] px-5 py-3.5 text-xs text-[#718078] sm:px-6">
              <CheckCircle2 className="shrink-0 text-[#16834B]" size={15} />
              Net balances add up to {formatPaise(balances.reduce((total, balance) => total + balance.netPaise, 0))}.
            </div>
          )}
        </>
      )}
    </section>
  )
}
