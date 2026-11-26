import { useMemo } from 'react'
import { calculateSettlements } from '../../../services/settlementService.js'
import { useBalances } from '../../balances/hooks/useBalances.js'

export function useSettlement() {
  const { members } = useBalances()
  return useMemo(() => calculateSettlements(members), [members])
}
