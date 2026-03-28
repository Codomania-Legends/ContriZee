import React, { useState } from 'react'
import { useNavigate } from 'react-router';

function Select_Expense({ members }) {
    const navigate = useNavigate();
    
    // Selection States
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [amount, setAmount] = useState("");

    // Add these to your state definitions at the top of Select_Expense
    const [currency, setCurrency] = useState("INR");
    const [convertedAmount, setConvertedAmount] = useState("");

    // Current approximate rates (Update these as needed)
    const rates = { 
        INR: 1, 
        USD: 94.86, 
        EUR: 109.01, 
        GBP: 128.85 
    };

    // Helper to get the correct symbol
    const getSymbol = (code) => {
        const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
        return symbols[code] || "₹";
    };
    // This state stores all confirmed payments
    const [expenses, setExpenses] = useState([]);

    const categories = {
        Food: { icon: "🍔", items: ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Water Bottle", "Other"] },
        Stay: { icon: "🏨", items: ["Hotel", "PG", "Hostel", "Resort", "Homestay", "Campsite", "Airbnb", "Guest House", "Other"] },
        Travel: { icon: "🚕", items: ["Cab", "Toll", "Tickets", "Personal Vehicle( Petrol/Diesel/CNG )", "Parking", "Public Transport", "Other"] }
    };

    const handleAddExpense = (finalInrValue) => {
        // if (!selectedMember || !selectedSub || !amount) {
        //     alert("Please complete all selections and enter an amount!");
        //     return;
        // }

        const newExpense = {
            id: Date.now(),
            payerId: selectedMember,
            payerName: members.find(m => m.id === selectedMember)?.name,
            category: selectedCategory,
            item: selectedSub,
            amount: parseFloat(finalInrValue)
        };

        setExpenses([...expenses, newExpense]);
        
        // Reset fields for the next entry
        setSelectedSub(null);
        setAmount("");
        alert("Expense Added!");
    };

    return (
        <div className="max-w-md mx-auto p-6 min-h-screen">
            
            {/* 1. Team Members Row */}
            <div className="mb-10 text-center">
                <h3 className="text-gray-500 text-xs font-bold mb-4 tracking-widest uppercase">1. Who Paid?</h3>
                <div className="flex justify-center gap-6">
                    {members.map((m) => (
                        <div key={m.id} className="flex flex-col items-center gap-2">
                            <button 
                                onClick={() => {
                                    setSelectedMember(m.id);
                                    setSelectedCategory(null);
                                    setSelectedSub(null);
                                }}
                                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all ${
                                    selectedMember === m.id 
                                    ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg' 
                                    : 'border-gray-300 text-gray-400 hover:border-indigo-300'
                                }`}
                            >
                                {m.name.charAt(0).toUpperCase()}
                            </button>
                            <span className="text-xs font-medium text-gray-600">{m.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Categories Row */}
            {selectedMember && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-around items-center bg-gray-50 p-4 rounded-2xl">
                        {Object.keys(categories).map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setSelectedSub(null);
                                }}
                                className="flex items-center gap-2 group"
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    selectedCategory === cat ? 'border-indigo-600' : 'border-gray-400'
                                }`}>
                                    {selectedCategory === cat && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                </div>
                                <span className={`text-sm font-bold ${selectedCategory === cat ? 'text-indigo-600' : 'text-gray-500'}`}>
                                    {cat}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Sub-Categories Grid */}
            {selectedCategory && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-300">
                    {categories[selectedCategory].items.map((item) => (
                        <button 
                            key={item}
                            onClick={() => setSelectedSub(item)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                                selectedSub === item 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                : 'border-gray-100 bg-white text-gray-500'
                            }`}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedSub === item ? 'border-indigo-600' : 'border-gray-300'
                            }`}>
                                {selectedSub === item && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                            </div>
                            <span className="text-sm font-semibold">{item}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* 4. Amount & Save Section */}
            {selectedSub && (
                <div className="mt-6 p-6 bg-indigo-900 rounded-[2.5rem] text-white shadow-xl animate-in slide-in-from-bottom-6 transition-all">
                    
                    {/* Header with Multi-Currency Selector */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-indigo-200 text-[10px] uppercase font-bold tracking-widest">
                            Amount for {selectedSub}
                        </p>
                        <div className="flex bg-white/10 p-1 rounded-xl gap-1">
                            {Object.keys(rates).map((code) => (
                                <button 
                                    key={code}
                                    onClick={() => {
                                        setCurrency(code);
                                        // We don't reset amount so users can see the conversion immediately
                                    }}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                                        currency === code ? 'bg-white text-indigo-900' : 'text-indigo-300 hover:text-white'
                                    }`}
                                >
                                    {code}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl font-black text-indigo-400">
                            {getSymbol(currency)}
                        </span>
                        <input 
                            type="number" 
                            inputMode="decimal"
                            value={convertedAmount}
                            onChange={(e) => setConvertedAmount(e.target.value)}
                            placeholder="0.00" 
                            className="bg-transparent text-5xl font-black outline-none w-full placeholder:text-indigo-800"
                            autoFocus
                        />
                    </div>

                    {/* --- LIVE INR PREVIEW FOR ALL NON-INR CURRENCIES --- */}
                    <div className="h-8 mb-6">
                        {convertedAmount > 0 && currency !== "INR" && (
                            <div className="flex items-center gap-2 text-green-400 animate-in fade-in slide-in-from-left-2">
                                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Approx.</span>
                                <span className="text-lg font-black italic">
                                    ₹{(convertedAmount * rates[currency]).toLocaleString('en-IN', { maximumFractionDigits: 2 })} INR
                                </span>
                            </div>
                        )}
                    </div>

                    <button 
                        disabled={!convertedAmount || convertedAmount <= 0}
                        onClick={() => {
                            // Calculate final INR value based on the selected currency's rate
                            const finalInrValue = parseFloat(convertedAmount) * rates[currency];
                            handleAddExpense(finalInrValue);
                        }}
                        className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all ${
                            convertedAmount > 0 ? 'bg-white text-indigo-900' : 'bg-indigo-800 text-indigo-600'
                        }`}
                    >
                        {convertedAmount > 0 ? "CONFIRM & ADD" : "ENTER AMOUNT"}
                    </button>
                </div>
            )}
            {/* 5. Floating Navigation Button */}
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
    )
}

export default Select_Expense