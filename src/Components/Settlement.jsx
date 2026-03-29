import React, { useEffect, useState } from 'react';
import { splitExpenses } from '../Utility/Algo';
import { useLocation, useNavigate } from 'react-router';
import Xarrow from 'react-xarrows'; 
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useUser } from '../UserContext'; // 🪄 Import the Context!

const colors = ["#4A90E2", "#50E3C2", "#B8E986", "#FFD200", "#FF6B6B"];

function Settlement() { // 🧹 Removed 'members' from props
    // 📥 Pull members from global state!
    const { members } = useUser();
    
    const [transactions, setTransactions] = useState([]);
    const [showOptions, setShowOptions] = useState(null); // Track which member is clicked
    const location = useLocation();
    const navigate = useNavigate();
    const expenses = location?.state?.expenses || [];

    const exportFormat = "Quick ContriZee update: Hey [Payee], you're down ₹[Amount] for the latest bill. 💸 Hit me up when you've sent it so I can mark it settled! 📱⚡";

    useEffect(() => {
        // Only run if we actually have members and expenses to avoid crash 🛡️
        if (members.length > 0) {
            const Details = {
                members: members.map(m => m.name),
                expenses: expenses
            };
            const result = splitExpenses(Details);
            setTransactions(result.transactions);
        }
    }, [members, expenses]);

    // Animation for the popup buttons 🎬
    useGSAP(() => {
        if (showOptions !== null) {
            gsap.fromTo(".options-popup", { opacity: 0, scale: 0.8, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" });
        }
    }, [showOptions]);

    const handleSettle = (index) => {
        const newTransactions = [...transactions];
        // Remove the transaction from the list 🗑️
        newTransactions.splice(index, 1);
        setTransactions(newTransactions);
        setShowOptions(null);
        alert("Transaction marked as Settled! ✅");
    };

    const handleAsk = (item) => {
        const text = exportFormat.replace("[Payee]", item.from).replace("[Amount]", item.amount.toFixed(2));
        navigator.clipboard.writeText(text);
        alert(`Request copied for ${item.from}! 📋`);
        setShowOptions(null);
    };

    const radius = 250; 
    const center = { x: 300, y: 300 }; 

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', position: 'relative' }}>
            {/* Header with Back button 🔙 */}
            <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-black transition-colors">
                    ← Back
                </button>
                <h2 style={{ textAlign: 'center', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Settlement Plan 💸</h2>
                <div style={{ width: '50px' }}></div> {/* Spacer ⚖️ */}
            </div>

            {/* Circular Graph Area 🕸️ */}
            <div style={{ position: 'relative', width: '600px', height: '600px', margin: '0 auto', zIndex: 1 }}>
                
                {members.map((m, index) => {
                    const angle = (index / members.length) * 2 * Math.PI;
                    const x = center.x + radius * Math.cos(angle) - 60;
                    const y = center.y + radius * Math.sin(angle) - 60;

                    const pendingTransactionIdx = transactions.findIndex(t => t.from === m.name);
                    const pendingTransaction = transactions[pendingTransactionIdx];

                    return (
                        <div 
                            id={m.name} 
                            key={m.name}
                            onClick={() => pendingTransaction ? setShowOptions(showOptions === index ? null : index) : null}
                            style={{
                                position: 'absolute', 
                                left: `${x}px`, 
                                top: `${y}px`,
                                width: '120px', 
                                height: '120px',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                borderRadius: '50%', 
                                border: `3px solid ${colors[index % colors.length]}`,
                                background: '#f9f9f9', 
                                fontWeight: 'bold', 
                                color: colors[index % colors.length],
                                cursor: pendingTransaction ? 'pointer' : 'default',
                                zIndex: 20,
                                overflow: 'visible',
                                animation : true
                            }}
                            className='small-box-shadow'
                        >
                            {/* POPUP MENU 💬 */}
                            {showOptions === index && (
                                <div 
                                    className="options-popup" 
                                    style={{
                                        position: 'absolute',
                                        top: '-90px', 
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        zIndex: 999, 
                                        pointerEvents: 'auto' 
                                    }}
                                >
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleAsk(pendingTransaction); }}
                                        className="bg-blue-500 text-white text-[11px] px-4 py-2 rounded-full shadow-xl whitespace-nowrap hover:scale-105 transition-transform"
                                    >
                                        📩 Ask Money
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleSettle(pendingTransactionIdx); }}
                                        className="bg-green-600 text-white text-[11px] px-4 py-2 rounded-full shadow-xl whitespace-nowrap hover:scale-105 transition-transform"
                                    >
                                        ✅ Settle Now
                                    </button>
                                </div>
                            )}

                            {/* Node Avatar 👤 */}
                            <div className='flex flex-col items-center justify-center'>
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mb-1">
                                    {m.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs">{m.name}</span>
                            </div>
                        </div>
                    );
                })}

                {/* Xarrows connecting the nodes 🔗 */}
                {transactions.map((item, index) => (
                    <Xarrow
                        key={index}
                        start={item.from}
                        end={item.to}
                        path="smooth"
                        curviness={0.5}
                        color="#4ade80" 
                        strokeWidth={2}
                        dashness={{ strokeLen: 8, nonStrokeLen: 6, animation: true }}
                        labels={{ 
                            middle: (
                                <div className="bg-white px-3 py-1 rounded-full border border-green-500 text-sm font-bold text-green-700 shadow-sm">
                                    ₹{item.amount.toFixed(2)}
                                </div>
                            ) 
                        }}
                        headSize={5}
                    />
                ))}
            </div>

            {/* Summary List Area 📝 */}
            <div style={{ marginTop: '50px', background: '#f4f4f4', padding: '20px', borderRadius: '15px' }} className="max-w-2xl mx-auto">
                <h3 className="font-bold mb-3">Active Debts 📋</h3>
                {transactions.length === 0 ? (
                    <p className="text-green-600 font-medium">Everyone is square! No debts found. ✨</p>
                ) : (
                    transactions.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                            <span><b>{item.from}</b> owes <b>{item.to}</b>: ₹{item.amount.toFixed(2)}</span>
                            <button 
                                onClick={() => handleSettle(idx)}
                                className="text-xs bg-white border border-green-500 text-green-600 px-2 py-1 rounded-md hover:bg-green-50 active:scale-95 transition-transform"
                            >
                                Settle
                            </button>
                        </div>
                    ))
                )}
            </div>

            <style>
                {`
                    .small-box-shadow { box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease; }
                    .small-box-shadow:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
                `}
            </style>
        </div>
    );
}

export default Settlement;