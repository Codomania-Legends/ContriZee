import React from 'react'
import { sileo } from 'sileo'

export async function WhoPaysNext(members, expenses, openRouter) {
    try {
        // Return the AI advice string directly
        const advice = await GetAIAdvice(members, expenses, openRouter);
        return advice; 
    } catch (error) {
        // Fallback logic
        if (expenses.length === 0) {
            return members[Math.floor(Math.random() * members.length)].name + " should pay next!";
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
        
        return `${nextPayer.name} has paid the least and should pay next!`;
    }
}

export async function GetAIAdvice(members, expenses, openRouter) {
    const prompt = `
    You are a helpful assistant that analyzes expenses and gives advice.
    Members: ${members.map(m => m.name).join(', ')}
    Expenses: ${JSON.stringify(expenses)}

    You have to choose a member, if there is no payment Choose randomly.
    
    Give me a very short advice (max 10 words) on who should pay next.
    `;
    const response = await openRouter.chat.send({
        chatGenerationParams: {
            model: 'openrouter/free',
            messages: [{ role: 'user', content: prompt }],
        }
    });
    return response.choices[0].message.content;
}