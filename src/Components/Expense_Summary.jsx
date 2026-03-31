import React from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../UserContext'; 
import { motion } from 'framer-motion'; // <-- Imported Framer Motion 🎬✨

function Expense_Summary() {
    const navigate = useNavigate();
    
    const { expenses } = useUser();
    
    const totalCost = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto p-6 min-h-screen"
        >
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate("/select-expense")} className="text-gray-400 hover:text-black transition-colors">
                    ← Back 🔙
                </button>
                <h2 className="text-xl font-black tracking-tighter uppercase italic">Trip Summary 🎒</h2>
                <div className="w-6"></div> 
            </div>

            {/* Bouncy pop-in for the Total Card! 💥💳 */}
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-[#C599B6] medium-box-shadow rounded-2xl p-8 shadow-xl shadow-[#d8bfcb] mb-10 relative overflow-hidden"
            >
                <div className="relative z-10">
                    <p className="text-[#8f577c] text-xs font-bold uppercase tracking-widest mb-2">Total Spends 💸</p>
                    <h1 className="text-5xl text-white font-black">₹{totalCost.toLocaleString()}</h1>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#9e6a8d] rounded-full opacity-50"></div>
            </motion.div>

            <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 px-2"
            >
                History 📜
            </motion.h3>
            
            <div className="space-y-4">
                {expenses.length > 0 ? (
                    expenses.map((exp, index) => (
                        // Staggered slide-in animation for each expense item! 🧗‍♂️🌟
                        <motion.div 
                            key={exp.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white small-box-shadow p-4 rounded-2xl shadow-sm flex items-center justify-between group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                                    {exp.category === 'Food' ? '🍔' : exp.category === 'Stay' ? '🏨' : '🚕'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{exp.item}</h4>
                                    <p className="text-xs text-gray-400">Paid by <span className="text-[#8f577c] font-semibold">{exp.paidBy}</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-black text-gray-800">₹{exp.amount}</span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-gray-400 italic">No expenses recorded yet. 🏜️</p>
                    </motion.div>
                )}
            </div>

            {expenses.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                    className="mt-10"
                >
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/settle-debts', { state: { expenses } })}
                        className="w-full bg-[#C599B6] small-box-shadow text-white py-5 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-3"
                    >
                        <span>Calculate Smart Settlement ⚖️</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI Optimized 🧠</span>
                    </motion.button>
                    <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed px-6">
                        Clicking this will run the greedy algorithm to minimize the total number of transactions between friends. 🤝✨
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}

export default Expense_Summary;