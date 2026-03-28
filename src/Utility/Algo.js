

export function splitExpenses(details) {
    const { members, expenses } = details;

    // Step 1: Initialize balances
    const balance = {};
    members.forEach(member => {
        balance[member] = 0;
    });

    // Step 2: Process each expense
    expenses.forEach(expense => {
        const { amount, paidBy, splitAmong } = expense;
        const share = amount / splitAmong.length;

        splitAmong.forEach(person => {
            balance[person] -= share;
        });

        balance[paidBy] += amount;
    });

    // Step 3: Separate creditors & debtors
    const creditors = [];
    const debtors = [];

    for (let person in balance) {
        if (balance[person] > 0) {
            creditors.push({ person, amount: balance[person] });
        } else if (balance[person] < 0) {
            debtors.push({ person, amount: -balance[person] });
        }
    }

    // Step 4: Simplify transactions
    const transactions = [];

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(debtor.amount, creditor.amount);

        transactions.push({
            from: debtor.person,
            to: creditor.person,
            amount: parseFloat(amount.toFixed(2))
        });

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount === 0) i++;
        if (creditor.amount === 0) j++;
    }

    return {
        balance,
        transactions
    };
}
