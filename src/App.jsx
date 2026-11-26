import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GroupProvider } from './app/GroupContext.jsx'
import { AppShell } from './features/layout/AppShell.jsx'
import { OverviewPage } from './features/dashboard/pages/OverviewPage.jsx'
import { ExpensesPage } from './features/expenses/pages/ExpensesPage.jsx'
import { MembersPage } from './features/members/pages/MembersPage.jsx'
import { BalancesPage } from './features/balances/pages/BalancesPage.jsx'
import { SettlementPage } from './features/settlement/pages/SettlementPage.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <GroupProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route element={<OverviewPage />} path="/" />
            <Route element={<ExpensesPage />} path="/expenses" />
            <Route element={<MembersPage />} path="/members" />
            <Route element={<BalancesPage />} path="/balances" />
            <Route element={<SettlementPage />} path="/settle-up" />
            <Route element={<SettingsPage />} path="/settings" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Route>
        </Routes>
      </GroupProvider>
    </BrowserRouter>
  )
}
