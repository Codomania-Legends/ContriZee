import React, { useEffect, useState } from 'react';
import { splitExpenses } from '../Utility/Algo';
import { useLocation, useNavigate } from 'react-router';
import Xarrow from 'react-xarrows'; 
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useUser } from '../UserContext';

const colors = ["#C599B6", "#eff7f6" ,"#50E3C2", "#B8E986", "#ff8fab", "#d5bdaf", "#a2d2ff", "#cdb4db", "#e4c1f9"];

function Settlement() {
    const { members, expenses } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [showOptions, setShowOptions] = useState(null);
    const navigate = useNavigate();

    const exportFormat = "Quick ContriZee update: Hey [Payee], you're down ₹[Amount] for the latest bill. 💸 Hit me up when you've sent it so I can mark it settled! 📱⚡";

    useEffect(() => {
        if (members.length > 0) {
            const Details = {
                members: members.map(m => m.name),
                expenses: expenses
            };
            const result = splitExpenses(Details);
            setTransactions(result.transactions);
        }
    }, [members, expenses]);

    useGSAP(() => {
        if (showOptions !== null) {
            gsap.fromTo(".options-popup", 
                { opacity: 0, scale: 0.8, y: 10 }, 
                { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
            );
        }
    }, [showOptions]);

    const handleSettle = (index) => {
        const newTransactions = [...transactions];
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
    const centerD = { x: 300, y: 300 }; 

    const [dimensions, setDimensions] = useState({
    width: window.innerWidth > 768 ? 600 : 350,
    radius: window.innerWidth > 768 ? 250 : 130,
    nodeSize: window.innerWidth > 768 ? 120 : 80
});

// 2. Update dimensions on resize
useEffect(() => {
    const handleResize = () => {
        const isDesktop = window.innerWidth > 768;
        setDimensions({
            width: isDesktop ? 600 : 350,
            radius: isDesktop ? 220 : 120, // Reduced radius slightly to prevent clipping
            nodeSize: isDesktop ? 120 : 80
        });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

const center = dimensions.width / 2;

    return (
        <div className="p-10 font-sans w-full flex flex-col items-center justify-center relative min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-black px-8 transition-colors">
                    ← Back
                </button>
                <h2 className="text-2xl px-8 font-bold text-center m-0">Settlement Plan 💸</h2>
                <div className="w-[50px]"></div>
            </div>

            {/* Circular Graph Area */}
            <div 
                className="relative z-10 touch-none" 
                style={{ width: `${dimensions.width}px`, height: `${dimensions.width}px` }}
            >
                {members.map((m, index) => {
                    const angle = (index / members.length) * 2 * Math.PI;
                    // Calculate coordinates based on dynamic center and radius
                    const x = center + dimensions.radius * Math.cos(angle) - (dimensions.nodeSize / 2);
                    const y = center + dimensions.radius * Math.sin(angle) - (dimensions.nodeSize / 2);

                    const pendingTransactionIdx = transactions.findIndex(t => t.from === m.name);
                    const pendingTransaction = transactions[pendingTransactionIdx];
                    const color = colors[index % colors.length];

                    return (
                        <div 
                            id={m.name} 
                            key={m.name}
                            onClick={() => pendingTransaction ? setShowOptions(showOptions === index ? null : index) : null}
                            style={{ 
                                left: `${x}px`, 
                                top: `${y}px`, 
                                width: `${dimensions.nodeSize}px`, 
                                height: `${dimensions.nodeSize}px`,
                                backgroundColor: color, 
                                color: color 
                            }}
                            className={`absolute flex items-center justify-center rounded-full small-box-shadow font-bold z-20 overflow-visible shadow-lg transition-all duration-300 ${pendingTransaction ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {/* POPUP MENU - Adjusted for mobile scale */}
                            {showOptions === index && (
                                <div className="options-popup absolute -top-20 md:-top-[90px] left-1/2 -translate-x-1/2 flex flex-col gap-1 md:gap-2 z-[999]">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleAsk(pendingTransaction); }}
                                        className="bg-blue-500 text-white text-[9px] md:text-[11px] px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-xl whitespace-nowrap"
                                    >
                                        📩 Ask
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleSettle(pendingTransactionIdx); }}
                                        className="bg-green-600 text-white text-[9px] md:text-[11px] px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-xl whitespace-nowrap"
                                    >
                                        ✅ Settle
                                    </button>
                                </div>
                            )}

                            {/* Node Avatar - Scaled for mobile */}
                            <div className="flex flex-col items-center justify-center scale-75 md:scale-100">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mb-1">
                                    {m.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[10px] md:text-xs text-black truncate max-w-[60px] md:max-w-none">
                                    {m.name}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Xarrows remains the same as it uses IDs to track the elements */}
                {transactions.map((item, index) => (
                    <Xarrow
                        key={index}
                        start={item.from}
                        end={item.to}
                        path="smooth"
                        curviness={0.5}
                        color="#4ade80" 
                        strokeWidth={window.innerWidth > 768 ? 2 : 1.5}
                        dashness={{ strokeLen: 8, nonStrokeLen: 6, animation: true }}
                        labels={{ 
                            middle: (
                                <div className="bg-white px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-green-500 text-[10px] md:text-sm font-bold text-green-700 shadow-sm flex items-center gap-1">
                                    ₹{item.amount.toFixed(0)}
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                </div>
                            ) 
                        }}
                        headSize={window.innerWidth > 768 ? 5 : 3}
                    />
                ))}
            </div>

            {/* Summary List Area */}
            <div className="mt-12 bg-[#d3d3d3] p-5 big-box-shadow rounded-2xl w-full shadow-inner">
                <h3 className="font-bold mb-3">Active Debts 📋</h3>
                {transactions.length === 0 ? (
                    <p className="text-green-600 font-medium">Everyone is square! No debts found. ✨</p>
                ) : (
                    transactions.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b-2 solid border-gray-100 last:border-">
                            <span><b className="font-bold">{item.from}</b> owes <b className="font-bold">{item.to}</b>: ₹{item.amount.toFixed(2)}</span>
                            <button 
                                onClick={() => handleSettle(idx)}
                                className="text-xs bg-white border border-green-500 text-green-600 px-3 py-1 rounded-md hover:bg-green-50 active:scale-95 transition-all"
                            >
                                Settle
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Settlement;