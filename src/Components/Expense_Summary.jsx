import React from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../UserContext'; 

function Expense_Summary() {
    const navigate = useNavigate();
    
    const { expenses } = useUser();
    
    const totalCost = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="max-w-md mx-auto p-6 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate("/select-expense")} className="text-gray-400 hover:text-black transition-colors">
                    ← Back
                </button>
                <h2 className="text-xl font-black tracking-tighter uppercase italic">Trip Summary 🎒</h2>
                <div className="w-6"></div> 
            </div>

            <div className="bg-indigo-600 medium-box-shadow rounded-2xl p-8 shadow-xl shadow-indigo-200 mb-10 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Total Spends</p>
                    <h1 className="text-5xl font-black">₹{totalCost.toLocaleString()}</h1>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full opacity-50"></div>
            </div>

            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 px-2">History</h3>
            <div className="space-y-4">
                {expenses.length > 0 ? (
                    expenses.map((exp) => (
                        <div key={exp.id} className="bg-white small-box-shadow p-4 rounded-2xl shadow-sm flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                                    {exp.category === 'Food' ? '🍔' : exp.category === 'Stay' ? '🏨' : '🚕'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{exp.item}</h4>
                                    <p className="text-xs text-gray-400">Paid by <span className="text-indigo-600 font-semibold">{exp.paidBy}</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-black text-gray-800">₹{exp.amount}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400 italic">No expenses recorded yet. 🏜️</p>
                    </div>
                )}
            </div>

            {expenses.length > 0 && (
                <div className="mt-10">
                    <button 
                        onClick={() => navigate('/settle-debts', { state: { expenses } })}
                        className="w-full bg-black small-box-shadow text-white py-5 rounded-2xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span>Calculate Smart Settlement</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI Optimized 🧠</span>
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed px-6">
                        Clicking this will run the greedy algorithm to minimize the total number of transactions between friends. 🤝
                    </p>
                </div>
            )}
        </div>
    );
}

export default Expense_Summary;