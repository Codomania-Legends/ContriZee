import { ref, push, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'; 
import { db } from '../firebase';
import { useUser } from '../UserContext'; 
import { sileo } from "sileo";
import Cookies from 'js-cookie';

function Select_Expense() {
    const navigate = useNavigate();

    // 1. Pull everything from Context. Note: we use activeTrip from tripDetails! 📥
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

    // Selection States
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    
    // Currency States
    const [currency, setCurrency] = useState("INR");
    const [convertedAmount, setConvertedAmount] = useState("");

    const rates = { INR: 1, USD: 94.86, EUR: 109.01, GBP: 128.85 };

    const getSymbol = (code) => {
        const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
        return symbols[code] || "₹";
    };

    const categories = {
        Food: { icon: "🍔", items: ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Water Bottle", "Other"] },
        Stay: { icon: "🏨", items: ["Hotel", "PG", "Hostel", "Resort", "Homestay", "Campsite", "Airbnb", "Guest House", "Other"] },
        Travel: { icon: "🚕", items: ["Cab", "Toll", "Tickets", "Personal Vehicle( Petrol/Diesel/CNG )", "Parking", "Public Transport", "Other"] }
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
            loading: { title: "Saving expense..." },
            success: { 
                title: "Added! 🎉",
                description: `${payer?.name} paid ₹${numericAmount.toFixed(2)}`
            },
            error: { title: "Failed to save ⚠️" },
        });

        // Reset UI fields
        setSelectedSub(null);
        setConvertedAmount("");
    };

    return (
        <div className="max-w-md mx-auto p-6 min-h-screen pb-32">
            
            {/* Header: Show which trip we are adding to! 📍 */}
            <div className="mb-6 text-center">
                <h2 className="text-xl font-black text-gray-800">{activeTrip?.name || "No Trip Selected"}</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Logging Expense</p>
            </div>

            {/* 1. Team Members Row 👤 */}
            <div className="mb-8 text-center">
                <h3 className="text-gray-500 text-[10px] font-bold mb-4 tracking-widest uppercase">1. Who Paid?</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                    {activeTrip?.members?.map((m) => (
                        <div key={m.id} className="flex flex-col items-center gap-2">
                            <button 
                                onClick={() => {
                                    setSelectedMember(m.id);
                                    setSelectedCategory(null);
                                    setSelectedSub(null);
                                }}
                                className={`w-14 h-14 small-box-shadow rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all ${
                                    selectedMember === m.id 
                                    ? 'pink text-black scale-110 border-black' 
                                    : 'bg-white border-gray-200 text-gray-400'
                                }`}
                            >
                                {m.name.charAt(0).toUpperCase()}
                            </button>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{m.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Categories Row 🏷️ */}
            {selectedMember && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-around items-center pink p-4 rounded-2xl medium-box-shadow bg-amber-950 text-white">
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
                                    selectedCategory === cat ? 'border-emerald-200' : 'border-white'
                                }`}>
                                    {selectedCategory === cat && <div className="w-2.5 h-2.5 bg-emerald-200 rounded-full" />}
                                </div>
                                <span className={`text-sm font-bold ${selectedCategory === cat ? 'text-emerald-200' : 'text-white'}`}>
                                    {cat}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Sub-Categories Grid 🗂️ */}
            {selectedCategory && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-300">
                    {categories[selectedCategory].items.map((item) => (
                        <button 
                            key={item}
                            onClick={() => setSelectedSub(item)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all small-box-shadow ${
                                selectedSub === item 
                                ? 'border-red-900 text-red-900 bg-red-300' 
                                : 'border-gray-100 bg-white text-gray-500'
                            }`}
                        >
                            <span className="text-sm font-semibold">{item}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* 4. Amount & Save Section 💰 */}
            {selectedSub && (
                <div className="mt-6 p-6 medium-box-shadow rounded-[2.5rem] text-black shadow-xl animate-in slide-in-from-bottom-6 transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-[#8f577c] text-[10px] uppercase font-bold tracking-widest">Amount for {selectedSub}</p>
                        <div className="flex bg-white/10 p-1 rounded-xl gap-1">
                            {Object.keys(rates).map((code) => (
                                <button 
                                    key={code}
                                    onClick={() => setCurrency(code)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                                        currency === code ? 'bg-white text-[#e7b9d8]' : 'text-[#8f577c]'
                                    }`}
                                >
                                    {code}
                                </button>
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
                        {convertedAmount > 0 && currency !== "INR" && (
                            <div className="flex items-center gap-2 text-green-500 animate-in fade-in slide-in-from-left-2">
                                <span className="text-lg font-black italic">
                                    ≈ ₹{(convertedAmount * rates[currency]).toFixed(2)} INR
                                </span>
                            </div>
                        )}
                    </div>

                    <button 
                        disabled={!convertedAmount || convertedAmount <= 0}
                        onClick={() => handleAddExpense(parseFloat(convertedAmount) * rates[currency])}
                        className={`w-full py-4 rounded-2xl font-black text-lg active:scale-95 transition-all small-box-shadow ${
                            convertedAmount > 0 ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        CONFIRM & ADD
                    </button>
                </div>
            )}
            
            {/* 5. Floating Navigation Button 🚀 */}
            {expenses.length > 0 && (
                <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-50">
                    <button 
                        onClick={() => navigate('/expense-summary')}
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex justify-between items-center px-6 shadow-2xl active:scale-95 transition-transform"
                    >
                        <span>View {expenses.length} Expenses</span>
                        <span>→</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Select_Expense;