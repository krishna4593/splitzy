import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useGroup } from '../../app/useGroup.js'
import { Sidebar } from './Sidebar.jsx'
import { Topbar } from './Topbar.jsx'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { group, storageError, resetGroup } = useGroup()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#142C26]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-h-screen lg:pl-[260px]">
        <Topbar
          group={group}
          onMenuClick={() => setMobileOpen(true)}
          onReset={resetGroup}
          pathname={pathname}
        />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
          {storageError && (
            <div
              className="mb-6 rounded-xl border border-[#EFC8BD] bg-[#FFF4F0] px-4 py-3 text-sm text-[#A84938]"
              role="alert"
            >
              {storageError} Your changes may not persist until this is resolved.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
