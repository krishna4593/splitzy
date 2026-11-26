function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `member-${Date.now()}-${Math.random()}`
}

export function addMember(group, name) {
  const normalizedName = name.trim()

  if (!normalizedName) throw new Error('Enter a member name.')
  if (group.members.some((member) => member.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase())) {
    throw new Error('A member with that name already exists.')
  }
  if (group.members.length >= 10) throw new Error('A group can have at most 10 members.')

  const member = { id: createId(), name: normalizedName }
  return { ...group, members: [...group.members, member] }
}

export function removeMember(group, memberId) {
  if (group.members.length <= 2) throw new Error('A group must have at least 2 members.')

  const hasExpenses = group.expenses.some(
    (expense) =>
      expense.paidById === memberId || expense.participantIds.includes(memberId),
  )
  if (hasExpenses) throw new Error('Remove this member’s expenses before removing them.')

  const members = group.members.filter((member) => member.id !== memberId)
  const currentMemberId =
    group.settings.currentMemberId === memberId
      ? members[0]?.id ?? ''
      : group.settings.currentMemberId

  return {
    ...group,
    members,
    settings: { ...group.settings, currentMemberId },
  }
}

export function updateGroupSettings(group, settings) {
  const groupName = settings.groupName.trim()
  if (!groupName) throw new Error('Enter a group name.')

  const currentMemberExists = group.members.some(
    (member) => member.id === settings.currentMemberId,
  )
  if (group.members.length > 0 && !currentMemberExists) {
    throw new Error('Choose a current member from this group.')
  }

  return {
    ...group,
    settings: {
      groupName,
      currentMemberId: settings.currentMemberId,
    },
  }
}
