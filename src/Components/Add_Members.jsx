import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router';

function Add_Members({ members, setMembers }) {
    const [tempName, setTempName] = useState("");

    const addMember = () => {
        if (tempName.trim()) {
            setMembers([...members, { id: Date.now(), name: tempName.trim() }]);
            setTempName("");
        }
    };

    const removeMember = (id) => {
        setMembers(members.filter((m) => m.id !== id));
    };

    // --- NEXT ACTION LOGIC ---
    // We determine the button's state based on how many members are added.
    const canGoNext = members.length >= 2; // Usually need at least 2 people to split!
    const buttonText = canGoNext 
        ? "Ready to Split? Click Here →" 
        : `Add ${2 - members.length} more friend${members.length === 1 ? '' : 's'}`;

    return (
        <div className="min-h-screen"> {/* Added padding bottom to prevent button overlap */}
            <div className="p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Who's on this trip? 🎒</h2>
                
                {/* Input Area */}
                <div className="flex gap-2 mb-6">
                    <input 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addMember()}
                        placeholder="Enter friend's name..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                        onClick={addMember} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold active:scale-90 transition-transform"
                    >
                        Add
                    </button>
                </div>

                {/* Member List */}
                <div className="flex flex-wrap gap-2">
                    {members && members.length > 0 ? (
                        members.map((m) => (
                            <div 
                                key={m.id} 
                                className="flex items-center bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 transition-all active:scale-95 animate-in fade-in zoom-in-90"
                            >
                                <span className="text-sm font-medium">{m.name}</span>
                                <button 
                                    onClick={() => removeMember(m.id)}
                                    className="ml-2 p-0.5 hover:bg-gray-200 rounded-md text-gray-400 hover:text-red-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
                            <span className="text-gray-400 text-sm italic">No members added yet...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- THE NEXT ACTION NUDGE --- */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to from-white via-white to-transparent">
                <div className="max-w-md mx-auto">
                    <Link 
                        to={canGoNext ? "/select-expense" : "#"} 
                        className={`w-full flex items-center justify-center py-4 rounded-2xl font-bold transition-all duration-500 ${
                            canGoNext 
                            ? 'bg-green-600 text-white shadow-xl shadow-green-200 scale-100 animate-bounce-short' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed scale-95 opacity-70'
                        }`}
                        onClick={(e) => !canGoNext && e.preventDefault()} // Block click if not ready
                    >
                        {buttonText}
                    </Link>
                    
                    {/* Tiny nudge text */}
                    {canGoNext && (
                        <p className="text-center text-[10px] text-green-600 font-bold uppercase mt-2 tracking-widest animate-pulse">
                            Tap to start logging expenses
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Add_Members;