import React from 'react'
import { sileo } from 'sileo'

export function WhoPaysNext(members, expenses) {
    if (expenses.length === 0) {
        return sileo.show({
            title: "From my Analysis...",
            description: members[Math.floor(Math.random() * members.length)].name + " should pay next!",
            type: "success",
            duration: 5000,
        })
    }

    let memberTotals = members.map(m => ({ name: m.name, totalPaid: 0 }));

    expenses.forEach((item) => {
        if (memberTotals[item.paidBy]) {
            memberTotals[item.paidBy].totalPaid += item.amount;
        }
    });

    const nextPayer = memberTotals.reduce((prev, curr) => 
        (prev.totalPaid < curr.totalPaid) ? prev : curr
    );
    return sileo.show({
        title: "Analysis Complete 📈",
        description: `${nextPayer.name} has paid the least and should pay next!`,
        type: "success",
        duration: 5000,
    });
}