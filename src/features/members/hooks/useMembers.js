import { useState } from 'react'
import { useGroup } from '../../../app/useGroup.js'

export function useMembers() {
  const { group, addGroupMember, removeGroupMember } = useGroup()
  const [error, setError] = useState('')

  function add(name) {
    setError('')
    try {
      addGroupMember(name)
      return true
    } catch (addError) {
      setError(addError.message)
      return false
    }
  }

  function remove(memberId) {
    setError('')
    try {
      removeGroupMember(memberId)
      return true
    } catch (removeError) {
      setError(removeError.message)
      return false
    }
  }

  return { members: group.members, add, remove, error, clearError: () => setError('') }
}
