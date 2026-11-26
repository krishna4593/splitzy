import { useState } from 'react'
import { Menu, RotateCcw, ChevronDown } from 'lucide-react'
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx'
import { Avatar } from '../../components/Avatar.jsx'

const titles = {
  '/': 'Overview',
  '/expenses': 'Expenses',
  '/members': 'Members',
  '/balances': 'Balances',
  '/settle-up': 'Settle up',
  '/settings': 'Settings',
}

export function Topbar({ pathname, group, onMenuClick, onReset }) {
  const [groupMenuOpen, setGroupMenuOpen] = useState(false)
  const selectedMember =
    group.members.find((member) => member.id === group.settings.currentMemberId) ??
    group.members[0]

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#E6EBE7] bg-[#F7F8F6]/95 px-4 backdrop-blur sm:px-7 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open navigation"
          className="rounded-lg p-2 text-[#5F6C64] hover:bg-white lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={20} />
        </button>
        <div className="hidden min-w-0 sm:block">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A958F]">
            {group.settings.groupName}
          </p>
          <p className="truncate text-sm font-semibold text-[#142C26]">
            {titles[pathname] ?? 'Overview'}
          </p>
        </div>
        <div className="relative sm:hidden">
          <button
            aria-expanded={groupMenuOpen}
            className="flex max-w-[190px] items-center gap-2 rounded-lg border border-[#E2E8E3] bg-white px-3 py-2 text-sm font-medium text-[#142C26]"
            onClick={() => setGroupMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span className="truncate">{group.settings.groupName}</span>
            <ChevronDown size={16} />
          </button>
          {groupMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-[#E6EBE7] bg-white p-3 text-xs text-[#718078] shadow-lg">
              Edit your group name in Settings.
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden items-center gap-2 rounded-lg border border-[#E2E8E3] bg-white px-3 py-2 text-sm font-medium text-[#425148] md:flex">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4F2EB] text-[11px] font-semibold text-[#16834B]">
            {group.settings.groupName.slice(0, 1).toUpperCase()}
          </span>
          <span className="max-w-40 truncate">{group.settings.groupName}</span>
          <ChevronDown className="text-[#87938D]" size={15} />
        </span>
        <div className="flex items-center gap-2 border-l border-[#E2E8E3] pl-3 sm:pl-4">
          {selectedMember ? (
            <>
              <Avatar name={selectedMember.name} size="sm" />
              <span className="hidden max-w-24 truncate text-sm font-medium text-[#425148] sm:block">
                {selectedMember.name}
              </span>
            </>
          ) : (
            <span className="text-xs text-[#87938D]">No members</span>
          )}
        </div>
        <ConfirmDialog
          title="Reset this group?"
          description="This permanently clears all members, expenses, and balances from this device. You can’t undo this action."
          confirmLabel="Reset group"
          onConfirm={onReset}
          trigger={
            <button
              aria-label="Reset group"
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-[#A84938] transition-colors hover:bg-[#FFF1EC] sm:px-3"
              type="button"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset group</span>
            </button>
          }
        />
      </div>
    </header>
  )
}
