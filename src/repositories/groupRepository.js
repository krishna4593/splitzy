import { emptyGroup, seedGroup } from '../data/seedGroup.js'

const STORAGE_KEY = 'splitzy.group.v1'

export function loadGroup() {
  let savedGroup

  try {
    savedGroup = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    throw new Error('Splitzy could not access local storage. Check your browser privacy settings.')
  }

  if (!savedGroup) {
    saveGroup(seedGroup)
    return seedGroup
  }

  try {
    const parsedGroup = JSON.parse(savedGroup)
    if (
      !Array.isArray(parsedGroup.members) ||
      !Array.isArray(parsedGroup.expenses) ||
      !parsedGroup.settings
    ) {
      throw new Error('Saved group data has an invalid structure.')
    }

    return parsedGroup
  } catch (error) {
    throw new Error(
      error instanceof SyntaxError
        ? 'Saved group data could not be read. Reset the group to start fresh.'
        : error.message,
      { cause: error },
    )
  }
}

export function saveGroup(group) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(group))
  } catch {
    throw new Error('Splitzy could not save your changes to local storage.')
  }
}

export function clearStoredGroup() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    throw new Error('Splitzy could not clear the saved group from local storage.')
  }
}

export function createEmptyGroup() {
  return {
    settings: { ...emptyGroup.settings },
    members: [],
    expenses: [],
  }
}
