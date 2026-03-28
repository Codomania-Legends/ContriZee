import React, { useEffect, useState } from 'react';
import { splitExpenses } from '../Utility/Algo';
import { useLocation, useNavigate } from 'react-router';
import Xarrow from 'react-xarrows'; // Ensure this is installed: npm install react-xarrows

const colors = ["#4A90E2", "#50E3C2", "#B8E986", "#FFD200", "#FF6B6B"]; // Add more colors if needed

function Settlement({ members }) {
    const [transactions, setTransactions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate()
    const expenses = location?.state?.expenses || [];

    useEffect(() => {
        const Details = {
            members: members.map(m => m.name),
            expenses: expenses
        };
        const result = splitExpenses(Details);
        setTransactions(result.transactions);
    }, [members, expenses]);

    // Position members in a circle
    const radius = 250; // Radius of the circle
    const center = { x: 300, y: 300 }; // Center of the container

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', position: 'relative' }}>
            <h2 style={{ textAlign: 'center' }}>Settlement Plan 💸</h2>

            {/* Container with specified width and height to anchor the circular layout */}
            <div style={{ position: 'relative', width: '600px', height: '600px', margin: '0 auto', zIndex: 1 }}>
                
                {/* 1. Member Nodes: Positioned in a circle ⭕ */}
                {members.map((m, index) => {
                    // Calculate angle for each member based on its index
                    const angle = (index / members.length) * 2 * Math.PI;
                    
                    // Convert polar to cartesian coordinates
                    const x = center.x + radius * Math.cos(angle) - 60; // Adjust for node width/2
                    const y = center.y + radius * Math.sin(angle) - 60; // Adjust for node height/2

                    return (
                        <div 
                            id={m.name} // The ID used by Xarrow
                            key={m.name}
                            style={{
                                position: 'absolute',
                                left: `${x}px`,
                                top: `${y}px`,
                                padding: '15px',
                                width: '120px',
                                height: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%', // Circular Node
                                border: `3px solid ${colors[index % colors.length]}`,
                                background: '#f9f9f9',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: colors[index % colors.length],
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                zIndex: 2
                            }}
                        >
                            {m.name}
                        </div>
                    );
                })}

                {/* 2. Arrows: Curved arrows for every transaction 〰️ */}
                {transactions.map((item, index) => {
                    const amountText = `$${item.amount.toFixed(2)}`;
                    
                    return (
                        <Xarrow
                            key={index}
                            start={item.from} // ID of the debtor
                            end={item.to}     // ID of the creditor
                            path="smooth"     // 🗝️ Makes the arrow curvy!
                            curviness={0.5}   // Adjust curviness (0 to 1)
                            breakpoint={0.5}  // Adjust curve starting point
                            color="#e0e0e0"   // Use a light color as default
                            strokeWidth={1.5}
                            dashness={{ 
                                strokeLen: 8, 
                                nonStrokeLen: 12, 
                                animation: true 
                            }} // Static dashness for all, animation is fun
                            labels={{ 
                                middle: <div style={{ 
                                    background: 'white', 
                                    padding: '4px 10px', 
                                    borderRadius: '15px', 
                                    border: '1px solid green',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    color: 'green',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <span>${item.amount.toFixed(2)}</span>
                                    {/* Add a little animation to the amount */}
                                    <span className="pulse"></span>
                                </div> 
                            }}
                            headSize={6}
                        />
                    );
                })}
            </div>

            {/* 3. Text Fallback & Pulse animation */}
            <div style={{ marginTop: '100px', background: '#eee', padding: '15px', borderRadius: '8px' }}>
                <h3>Summary List</h3>
                {transactions.length === 0 && <p>All settled! ✅</p>}
                {transactions.map((item, idx) => (
                    <p key={idx}>⮕ {item.from} sends ${item.amount.toFixed(2)} to {item.to}</p>
                ))}
            </div>

            {/* Add pulse animation via style tag to keep it in one file */}
            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .pulse {
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: lightgreen;
                        animation: pulse 1.5s infinite;
                    }
                `}
            </style>
            {expenses.length > 0 && (
                <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto">
                    <button 
                        onClick={() => navigate('/expense-summary', { state: { expenses } })}
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex justify-between items-center px-6 shadow-2xl"
                    >
                        <span>View {expenses.length} Expenses</span>
                        <span>→</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Settlement;