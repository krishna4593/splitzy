import { useContext } from 'react'
import { GroupContext } from './GroupContextValue.jsx'

export function useGroup() {
  const context = useContext(GroupContext)
  if (!context) throw new Error('useGroup must be used inside GroupProvider.')
  return context
}
