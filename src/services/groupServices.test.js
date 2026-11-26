import test from 'node:test'
import assert from 'node:assert/strict'
import { seedGroup } from '../data/seedGroup.js'
import { calculateBalances } from './balanceService.js'
import { addExpense, deleteExpense } from './expenseService.js'
import { parseRupeesToPaise, splitAmountEqually } from './moneyService.js'
import { addMember, removeMember } from './memberService.js'
import { calculateSettlements } from './settlementService.js'

test('sample group balances and settlement match the expected amounts', () => {
  const { members, totalGroupExpensesPaise, totalNetPaise } = calculateBalances(seedGroup)

  assert.equal(totalGroupExpensesPaise, 135000)
  assert.equal(totalNetPaise, 0)
  assert.deepEqual(
    members.map(({ member, paidPaise, sharePaise, netPaise }) => [
      member.name,
      paidPaise,
      sharePaise,
      netPaise,
    ]),
    [
      ['Rahul', 90000, 35000, 55000],
      ['Priya', 30000, 50000, -20000],
      ['Aman', 15000, 50000, -35000],
    ],
  )

  assert.deepEqual(
    calculateSettlements(members).map(({ from, to, amountPaise }) => [
      from.name,
      to.name,
      amountPaise,
    ]),
    [
      ['Aman', 'Rahul', 35000],
      ['Priya', 'Rahul', 20000],
    ],
  )
})

test('settlement uses a globally minimum transaction count', () => {
  const members = [
    { member: { id: 'a', name: 'A' }, netPaise: 40000 },
    { member: { id: 'b', name: 'B' }, netPaise: 30000 },
    { member: { id: 'c', name: 'C' }, netPaise: -20000 },
    { member: { id: 'd', name: 'D' }, netPaise: -20000 },
    { member: { id: 'e', name: 'E' }, netPaise: -30000 },
  ]

  assert.equal(calculateSettlements(members).length, 3)
})

test('zero balances produce no settlement transactions', () => {
  assert.deepEqual(
    calculateSettlements([{ member: { id: 'a', name: 'A' }, netPaise: 0 }]),
    [],
  )
})

test('amount parsing and equal split preserve paise exactly', () => {
  assert.equal(parseRupeesToPaise('12.3'), 1230)
  assert.equal(parseRupeesToPaise('0.01'), 1)
  assert.equal(parseRupeesToPaise('12.345'), null)
  assert.equal(parseRupeesToPaise('-1'), null)
  assert.deepEqual(splitAmountEqually(100, 3), [34, 33, 33])
})

test('member validation blocks duplicates, over-capacity groups, and removing members with expenses', () => {
  const existingGroup = {
    settings: { groupName: 'Group', currentMemberId: 'one' },
    members: [
      { id: 'one', name: 'Ava' },
      { id: 'two', name: 'Ben' },
    ],
    expenses: [],
  }

  assert.throws(() => addMember(existingGroup, ' ava '), /already exists/i)
  assert.throws(() => removeMember(existingGroup, 'one'), /at least 2 members/i)

  const groupWithExpense = {
    ...existingGroup,
    members: [...existingGroup.members, { id: 'three', name: 'Cal' }],
    expenses: [
      { paidById: 'three', participantIds: ['one', 'three'] },
    ],
  }
  assert.throws(() => removeMember(groupWithExpense, 'three'), /expenses/i)
})

test('deleting an expense immediately changes derived balances', () => {
  const updatedGroup = deleteExpense(seedGroup, 'cab')
  const balances = calculateBalances(updatedGroup).members

  assert.equal(balances.find(({ member }) => member.id === 'priya').paidPaise, 0)
  assert.equal(balances.reduce((total, balance) => total + balance.netPaise, 0), 0)
})

test('new expenses reject invalid payer and participant values', () => {
  assert.throws(
    () =>
      addExpense(seedGroup, {
        title: 'Coffee',
        amountPaise: 100,
        paidById: 'missing',
        participantIds: ['rahul'],
      }),
    /who paid/i,
  )
  assert.throws(
    () =>
      addExpense(seedGroup, {
        title: 'Coffee',
        amountPaise: 100,
        paidById: 'rahul',
        participantIds: [],
      }),
    /at least one/i,
  )
})
