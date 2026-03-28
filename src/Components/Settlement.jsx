import React, { useEffect, useState } from 'react';
import { splitExpenses } from '../Utility/Algo';

function Settlement() {
    // Initialize as an empty array to avoid .map() errors on first render 🛡️
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const Details = {
            members: ["Anshul", "Vidhi", "Mohini", "Anjali"],
            expenses: [
                { amount: 6500, paidBy: "Anshul", splitAmong: ["Anshul", "Vidhi", "Anjali", "Mohini"] },
                { amount: 800, paidBy: "Vidhi", splitAmong: ["Anshul", "Anjali", "Mohini"] },
                { amount: 200, paidBy: "Mohini", splitAmong: ["Anshul", "Vidhi", "Anjali", "Mohini"] },
                { amount: 100, paidBy: "Anjali", splitAmong: ["Anshul", "Vidhi", "Anjali", "Mohini"] },
            ]
        };

        const result = splitExpenses(Details);
        setTransactions(result.transactions);
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Settlement Plan 💸</h2>
            {transactions.length > 0 ? (
                transactions.map((item, index) => (
                    <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee' }}>
                        <p>
                            <strong>{item.from}</strong> owes <strong>{item.to}</strong>: 
                            <span style={{ color: 'green', fontWeight: 'bold' }}> ${item.amount}</span>
                        </p>
                    </div>
                ))
            ) : (
                <p>All settled up! No transactions needed. ✅</p>
            )}
        </div>
    );
}

export default Settlement;