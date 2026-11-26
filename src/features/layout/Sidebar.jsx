import { NavLink } from 'react-router-dom'
import {
  Activity,
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  Settings,
  UsersRound,
  X,
} from 'lucide-react'

const navigation = [
  { label: 'Overview', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Expenses', to: '/expenses', icon: ReceiptText },
  { label: 'Members', to: '/members', icon: UsersRound },
  { label: 'Balances', to: '/balances', icon: Activity },
  { label: 'Settle up', to: '/settle-up', icon: HandCoins },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-[#142C26]/35 lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#E6EBE7] bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-[#F0F2F0] px-6">
          <NavLink className="flex items-center gap-3" onClick={onClose} to="/">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16834B] text-white">
              <HandCoins size={20} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-[17px] font-semibold tracking-tight text-[#142C26]">Splitzy</span>
              <span className="block text-[10px] font-medium tracking-[0.12em] text-[#87938D]">GROUP EXPENSES</span>
            </span>
          </NavLink>
          <button
            aria-label="Close menu"
            className="rounded-lg p-2 text-[#718078] hover:bg-[#F4F6F4] lg:hidden"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <nav aria-label="Main navigation" className="flex-1 space-y-1 px-4 py-6">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              end={end}
              key={to}
              onClick={onClose}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E4F2EB] text-[#16834B]'
                    : 'text-[#5F6C64] hover:bg-[#F6F8F6] hover:text-[#142C26]'
                }`
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-[#F0F2F0] px-6 py-5">
          <div className="flex items-center gap-2 text-xs text-[#718078]">
            <span className="h-2 w-2 rounded-full bg-[#16834B]" />
            Saved on this device
          </div>
          <p className="mt-4 text-xs italic text-[#8A958F]">Split expenses. Stay friends.</p>
        </div>
      </aside>
    </>
  )
}
