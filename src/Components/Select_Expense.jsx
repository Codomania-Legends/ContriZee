import { ref, push, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'; 
import { db } from '../firebase';
import { useUser } from '../UserContext'; 
import { sileo } from "sileo";
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Imported Framer Motion 🎬✨

function Select_Expense() {
    const navigate = useNavigate();

    // 1. Pull everything from Context. Note: we use activeTrip from tripDetails! 📥🎒
    const { user, members, expenses, tripDetails, setTripDetails } = useUser();
    const activeTrip = tripDetails?.activeTrip;
    
    useEffect( () => {
        if( !activeTrip ){
            const tripCookie = Cookies.get("activeTrip");
            console.log("cookie check -",tripCookie)
            setTripDetails({...tripDetails, activeTrip: tripCookie})
            if( !tripCookie ){
                navigate(`/add-members`)
            }
        }
    } , [activeTrip] )

    // Selection States 🎛️
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    
    // Currency States 💵💶
    const [currency, setCurrency] = useState("INR");
    const [convertedAmount, setConvertedAmount] = useState("");

    const rates = { INR: 1, USD: 94.86, EUR: 109.01, GBP: 128.85 };

    const getSymbol = (code) => {
        const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
        return symbols[code] || "₹";
    };

    const categories = {
        Food: { icon: "🍔", items: ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Water Bottle", "Other"] },
        Stay: { icon: "🏨", items: ["Hotel", "PG", "Hostel", "Resort", "Airbnb", "Guest House", "Other"] },
        Travel: { icon: "🚕", items: ["Cab", "Toll", "Tickets", "Personal Vehicle( Petrol/Diesel/CNG )", "Parking", "Other"] }
    };

    const handleAddExpense = (finalInrValue) => {
        // 🛡️ Safety check: Ensure a trip is actually active
        if (!activeTrip?.firebaseKey) {
            alert("Please select or create a trip first! 🎒");
            return;
        }

        const numericAmount = parseFloat(finalInrValue);
        if (!selectedMember || !selectedSub || isNaN(numericAmount)) {
            alert("Please complete all selections! 🛑");
            return;
        }

        const payer = members.find(m => m.id === selectedMember);
        const newExpense = {
            id: Date.now(), 
            payerId: selectedMember,
            paidBy: payer ? payer.name : "Unknown",
            category: selectedCategory,
            item: selectedSub,
            amount: numericAmount,
            splitAmong: members.map(member => member.name) 
        };

        // ✅ Correct Path: users/anshul/trips/TRIP_ID/expenses
        const expenseListRef = ref(db, `users/${user}/trips/${activeTrip.firebaseKey}/expenses`);
        const newExpenseRef = push(expenseListRef); 
        
        sileo.promise(set(newExpenseRef, newExpense), {
            loading: { title: "Saving expense... ⏳" },
            success: { 
                title: "Added! 🎉",
                description: `${payer?.name} paid ₹${numericAmount.toFixed(2)}`
            },
            error: { title: "Failed to save ⚠️" },
        });

        // Reset UI fields 🔄
        setSelectedSub(null);
        setConvertedAmount("");
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto p-6 min-h-screen pb-32"
        >

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 text-center"
            >
                <button className="text-gray-400 absolute top-4 left-4" onClick={() => navigate('/add-members')}> 🔙 Back</button>
            </motion.div>
            
            {/* Header: Show which trip we are adding to! 📍🗺️ */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 text-center"
            >
                <h2 className="text-xl font-black text-gray-800">{activeTrip?.name || "No Trip Selected"}</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Logging Expense 📝</p>
            </motion.div>

            {/* 1. Team Members Row 👤🧑‍🤝‍🧑 */}
            <div className="mb-8 text-center">
                <h3 className="text-gray-500 text-[10px] font-bold mb-4 tracking-widest uppercase">1. Who Paid? 💳</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                    {activeTrip?.members?.map((m, index) => (
                        <motion.div 
                            key={m.id} 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1, type: "spring" }}
                            className="flex flex-col items-center gap-2"
                        >
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    setSelectedMember(m.id);
                                    setSelectedCategory(null);
                                    setSelectedSub(null);
                                }}
                                className={`w-14 h-14 small-box-shadow rounded-full border-2 flex items-center justify-center text-xl font-bold transition-colors ${
                                    selectedMember === m.id 
                                    ? 'bg-[#C599B6] text-white border-black' 
                                    : 'bg-white border-gray-200 text-gray-400'
                                }`}
                            >
                                {m.name.charAt(0).toUpperCase()}
                            </motion.button>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter transition-colors ${selectedMember === m.id ? 'text-[#613051]' : 'text-gray-400'}`}>{m.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 2. Categories Row 🏷️📂 */}
            <AnimatePresence>
                {selectedMember && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="mb-8 overflow-hidden"
                    >
                        <div className="flex justify-around items-center pink p-4 rounded-2xl medium-box-shadow bg-[#C599B6] text-white">
                            {Object.keys(categories).map((cat) => (
                                <motion.button 
                                    key={cat}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setSelectedSub(null);
                                    }}
                                    className="flex items-center gap-2 group"
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        selectedCategory === cat ? 'border-[#5f1c48]' : 'border-white'
                                    }`}>
                                        {selectedCategory === cat && <motion.div layoutId="cat-dot" className="w-2.5 h-2.5 bg-[#5f1c48] rounded-full" />}
                                    </div>
                                    <span className={`text-sm font-bold transition-colors ${selectedCategory === cat ? 'text-[#5f1c48]' : 'text-white'}`}>
                                        {cat} {categories[cat].icon}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Sub-Categories Grid 🗂️📋 */}
            <AnimatePresence mode="wait">
                {selectedCategory && (
                    <motion.div 
                        key={selectedCategory}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        {categories[selectedCategory].items.map((item, index) => (
                            <motion.button 
                                key={item}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelectedSub(item)}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors small-box-shadow ${
                                    selectedSub === item 
                                    ? 'border-[#C599B6] text-[#5f1c48] bg-[#C599B6]' 
                                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                <span className="text-sm font-semibold">{item}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. Amount & Save Section 💰🏦 */}
            <AnimatePresence>
                {selectedSub && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="mt-6 p-6 medium-box-shadow rounded-[2.5rem] shadow-xl bg-white"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-[#8f577c] text-[10px] uppercase font-bold tracking-widest">Amount for {selectedSub} 💸</p>
                            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                                {Object.keys(rates).map((code) => (
                                    <motion.button 
                                        key={code}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setCurrency(code)}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-black transition-colors ${
                                            currency === code ? 'bg-white text-[#e7b9d8] small-box-shadow' : 'text-[#8f577c] hover:bg-gray-200'
                                        }`}
                                    >
                                        {code}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl font-black text-[#8f577c]">{getSymbol(currency)}</span>
                            <input 
                                type="number" 
                                inputMode="decimal"
                                value={convertedAmount}
                                onChange={(e) => setConvertedAmount(e.target.value)}
                                placeholder="0.00" 
                                className="bg-transparent text-5xl font-black outline-none w-full text-[#C599B6]"
                                autoFocus
                            />
                        </div>

                        <div className="h-8 mb-6">
                            <AnimatePresence>
                                {convertedAmount > 0 && currency !== "INR" && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex items-center gap-2 text-[#8f577c]"
                                    >
                                        <span className="text-lg font-black italic">
                                            ≈ ₹{(convertedAmount * rates[currency]).toFixed(2)} INR 🇮🇳
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button 
                            whileHover={convertedAmount > 0 ? { scale: 1.02 } : {}}
                            whileTap={convertedAmount > 0 ? { scale: 0.95 } : {}}
                            disabled={!convertedAmount || convertedAmount <= 0}
                            onClick={() => handleAddExpense(parseFloat(convertedAmount) * rates[currency])}
                            className={`w-full py-4 rounded-2xl font-black text-lg transition-colors small-box-shadow ${
                                convertedAmount > 0 ? 'bg-[#8f577c] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            CONFIRM & ADD ✅
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* 5. Floating Navigation Button 🚀🧭 */}
            <AnimatePresence>
                {expenses.length > 0 && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-50"
                    >
                        <motion.button 
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/expense-summary')}
                            className="w-full bg-black small-box-shadow text-white py-4 rounded-2xl font-bold flex justify-between items-center px-6 shadow-2xl"
                        >
                            <span>View {expenses.length} Expenses 📋</span>
                            <span>→</span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Select_Expense;