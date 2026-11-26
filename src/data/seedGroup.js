export const seedGroup = {
  settings: {
    groupName: 'Weekend Crew',
    currentMemberId: 'rahul',
  },
  members: [
    { id: 'rahul', name: 'Rahul' },
    { id: 'priya', name: 'Priya' },
    { id: 'aman', name: 'Aman' },
  ],
  expenses: [
    {
      id: 'dinner',
      title: 'Dinner',
      amountPaise: 90000,
      paidById: 'rahul',
      participantIds: ['rahul', 'priya', 'aman'],
      date: '2026-10-12T12:00:00.000Z',
    },
    {
      id: 'cab',
      title: 'Cab',
      amountPaise: 30000,
      paidById: 'priya',
      participantIds: ['priya', 'aman'],
      date: '2026-10-11T12:00:00.000Z',
    },
    {
      id: 'snacks',
      title: 'Snacks',
      amountPaise: 15000,
      paidById: 'aman',
      participantIds: ['rahul', 'priya', 'aman'],
      date: '2026-10-10T12:00:00.000Z',
    },
  ],
}

export const emptyGroup = {
  settings: {
    groupName: 'Weekend Crew',
    currentMemberId: '',
  },
  members: [],
  expenses: [],
}
