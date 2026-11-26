import { useCallback, useRef, useState } from 'react'
import { GroupContext } from './GroupContextValue.jsx'
import { addExpense, deleteExpense } from '../services/expenseService.js'
import { addMember, removeMember, updateGroupSettings } from '../services/memberService.js'
import {
  createEmptyGroup,
  loadGroup,
  saveGroup,
} from '../repositories/groupRepository.js'

function loadInitialState() {
  try {
    return { group: loadGroup(), storageError: '', storageReady: true }
  } catch (error) {
    return {
      group: createEmptyGroup(),
      storageError: error.message,
      storageReady: false,
    }
  }
}

export function GroupProvider({ children }) {
  const [initialState] = useState(loadInitialState)
  const [group, setGroup] = useState(initialState.group)
  const [storageError, setStorageError] = useState(initialState.storageError)
  const storageReady = useRef(initialState.storageReady)
  const groupRef = useRef(initialState.group)

  const updateGroup = useCallback((updater) => {
    if (!storageReady.current) {
      throw new Error('Reset the group before making changes because saved data could not be loaded.')
    }

    const nextGroup = updater(groupRef.current)
    try {
      saveGroup(nextGroup)
    } catch (error) {
      setStorageError(error.message)
      throw error
    }
    groupRef.current = nextGroup
    setGroup(nextGroup)
    setStorageError('')
    return nextGroup
  }, [])

  const addGroupMember = useCallback(
    (name) => updateGroup((currentGroup) => addMember(currentGroup, name)),
    [updateGroup],
  )
  const removeGroupMember = useCallback(
    (memberId) => updateGroup((currentGroup) => removeMember(currentGroup, memberId)),
    [updateGroup],
  )
  const addGroupExpense = useCallback(
    (expense) => updateGroup((currentGroup) => addExpense(currentGroup, expense)),
    [updateGroup],
  )
  const deleteGroupExpense = useCallback(
    (expenseId) => updateGroup((currentGroup) => deleteExpense(currentGroup, expenseId)),
    [updateGroup],
  )
  const saveSettings = useCallback(
    (settings) =>
      updateGroup((currentGroup) => updateGroupSettings(currentGroup, settings)),
    [updateGroup],
  )

  const resetGroup = useCallback(() => {
    const emptyGroup = createEmptyGroup()
    try {
      saveGroup(emptyGroup)
    } catch (error) {
      setStorageError(error.message)
      throw error
    }
    groupRef.current = emptyGroup
    storageReady.current = true
    setGroup(emptyGroup)
    setStorageError('')
  }, [])

  return (
    <GroupContext.Provider
      value={{
        group,
        storageError,
        addGroupMember,
        removeGroupMember,
        addGroupExpense,
        deleteGroupExpense,
        saveSettings,
        resetGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}
