# Splitzy

Splitzy is a responsive, local-first expense-splitting dashboard for groups. Add shared expenses, see who paid and what each person owes, and get a globally minimized set of suggested repayments.

**Tagline:** Split expenses. Stay friends.

## Features

- **Overview dashboard:** Group spending, your personal balance, member balances, recent expenses, and suggested settlements.
- **Expense management:** Record a title, amount in INR, payer, and members sharing the cost. Expenses are shown newest first and can be deleted.
- **Member management:** Add and remove members, with validation for empty or duplicate names, group size, and members linked to expenses.
- **Balances:** See each member's total paid, total share, and net balance. A positive net means they are owed money; a negative net means they owe money.
- **Settle up:** Generate suggested payments that minimize the number of transfers across the whole group.
- **Settings:** Change the group name and choose which member represents your profile.
- **Local persistence:** Members, expenses, and settings are stored in this browser using `localStorage`; no account, backend, or database is used.
- **Responsive navigation:** The dashboard adapts to mobile, tablet, and desktop screens.
- **Reset group:** Clear the locally stored group after confirming the action.

## Getting started

### Requirements

- Node.js 20.19+ or 22.12+
- npm

### Install and run

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

### Other commands

```sh
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
npm test         # Run calculation and validation tests
```

## Using the dashboard

The first launch initializes a sample group named **Weekend Crew** with Rahul, Priya, and Aman, plus three sample expenses. This gives you an immediately populated dashboard; use **Reset group** to clear it and start with an empty group.

### Add members

Open **Members**, enter a name, and choose **Add member**. Names must be unique regardless of capitalization. A group can contain 2–10 members. Members cannot be removed while they have paid for or participated in an expense, and a group cannot be reduced below two members.

### Add and remove expenses

Open **Expenses** and enter a title, a positive amount, the payer, and at least one participant. Amounts accept up to two decimal places. Splits are equal; any leftover paise are assigned one at a time in the selected member order. Use the delete button on an expense to remove it; balances and settlements recalculate immediately.

### Read balances and settlements

For each member:

```text
net balance = total paid - total share
```

A positive result means the member should receive money. A negative result means the member should pay. Each expense is split in integer paise so rounding remains exact and the group net always sums to ₹0.

Settlement suggestions are calculated from the net balances. Splitzy uses an exact subset-partition search to maximize the number of zero-sum member groups; each group is then settled with at most one fewer transfer than members in that group. This minimizes transfers globally for the supported group size of up to 10 members.

### Change your profile or group name

Open **Settings** to rename the group or select which member is represented by your profile. The overview's “You owe” and “You get back” amounts follow that selection.

### Reset

Choose **Reset group** in the top navigation and confirm. This removes all members and expenses from the saved group on the current browser. Group data is stored per browser and is not synchronized to other devices.

## Sample calculation

The initial data demonstrates the following:

| Member | Paid | Share | Net |
| --- | ---: | ---: | ---: |
| Rahul | ₹900 | ₹350 | +₹550 |
| Priya | ₹300 | ₹500 | -₹200 |
| Aman | ₹150 | ₹500 | -₹350 |

Suggested payments:

- Aman pays Rahul ₹350.
- Priya pays Rahul ₹200.

The total expenses are ₹1,350. If Rahul is selected as your profile, **You owe** is ₹0 and **You get back** is ₹550.

## Project structure

```text
src/
  app/                 # Group context and application state
  components/          # Shared UI components
  data/                # Initial sample and empty group data
  features/
    balances/          # Balance page, table, and derived-state hook
    dashboard/         # Overview page
    expenses/          # Expense form, history, and feature hook
    layout/            # Sidebar, top navigation, and application shell
    members/           # Member management and feature hook
    settlement/        # Settlement page, list, and feature hook
  pages/               # Settings page
  repositories/        # localStorage access
  services/            # Member, expense, balance, settlement, and money logic
  App.jsx              # Routes
  main.jsx             # React entry point
```

Feature UI components call feature hooks, which use the shared group state and focused services. Services contain the business rules and calculations; the repository is responsible for browser storage.

## Technology

- React and Vite
- JavaScript (ES modules)
- Tailwind CSS
- React Router
- Lucide React
- Browser `localStorage`

All monetary calculations use integer paise. The app does not send group data to a server.
