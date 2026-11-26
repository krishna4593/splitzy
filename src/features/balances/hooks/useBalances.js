import { useMemo } from 'react'
import { useGroup } from '../../../app/useGroup.js'
import { calculateBalances } from '../../../services/balanceService.js'

export function useBalances() {
  const { group } = useGroup()
  return useMemo(() => calculateBalances(group), [group])
}
