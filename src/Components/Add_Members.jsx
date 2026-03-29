import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; 
import { useUser } from '../UserContext';
import { ref, set } from 'firebase/database'; // 👈 Import Firebase tools!
import { db } from '../firebase';

function Add_Members() {
    const { user, members } = useUser();
    const [tempName, setTempName] = useState("");

    // Automatically add the logged-in user to Firebase on first load 🎒
    useEffect(() => {
        if (user && members.length === 0) {
            const initialMember = [{ id: Date.now(), name: user }];
            // Push directly to Firebase! ☁️
            set(ref(db, `users/${user}/members`), initialMember);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, members.length]); // Wait for members to load before checking

    const addMember = () => {
        if (tempName.trim()) {
            if(!members.some(m => m.name.toLowerCase() === tempName.trim().toLowerCase())) {
                const updatedMembers = [...members, { id: Date.now(), name: tempName.trim() }];
                // Save the new array to Firebase! 💾
                set(ref(db, `users/${user}/members`), updatedMembers);
            }
            setTempName(""); 
        }
    };

    const removeMember = (id) => {
        const updatedMembers = members.filter((m) => m.id !== id);
        // Save the updated array to Firebase! 🗑️☁️
        set(ref(db, `users/${user}/members`), updatedMembers);
    };

    const canGoNext = members.length >= 2;
    const buttonText = canGoNext 
        ? "Ready to Split? Click Here →" 
        : `Add ${2 - members.length} more friend${members.length === 1 ? '' : 's'}`;

    return (
       /* KEEP ALL YOUR RETURN JSX EXACTLY THE SAME AS BEFORE! 🎨 */
       <div className="min-h-screen pb-32">
           {/* ... your UI code ... */}
            <div className="p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Who's on this trip? 🎒</h2>
                
                {/* Input Area ⌨️ */}
                <div className="flex gap-2 mb-6">
                    <input 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addMember()}
                        placeholder="Enter friend's name..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:pink outline-none"
                    />
                    <button 
                        onClick={addMember} 
                        className="small-box-shadow pink text-white px-4 py-2 rounded-lg font-bold active:scale-90 transition-transform"
                    >
                        Add
                    </button>
                </div>

                {/* Member List 📜 */}
                <div className="flex flex-wrap gap-2">
                    {members && members.length > 0 ? (
                        members.map((m) => (
                            <div 
                                key={m.id} 
                                className="small-box-shadow outline-0 flex items-center bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg transition-all active:scale-95 animate-in fade-in zoom-in-90"
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
                            <span className="text-gray-400 text-sm italic">No members added yet... 🏜️</span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- THE NEXT ACTION NUDGE --- 🧭 */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
                <div className="max-w-md mx-auto">
                    <Link 
                        to={canGoNext ? "/select-expense" : "#"} 
                        className={`w-full flex items-center justify-center py-4 rounded-2xl font-bold transition-all duration-500 small-box-shadow ${
                            canGoNext 
                            ? 'green text-white scale-100 animate-bounce-short' 
                            : 'pink text-white cursor-pointer scale-95 opacity-70'
                        }`}
                        onClick={(e) => !canGoNext && e.preventDefault()} // Block click if not ready ⛔
                    >
                        {buttonText}
                    </Link>
                    
                    {/* Tiny nudge text 🤏 */}
                    {canGoNext && (
                        <p className="text-center text-[10px] text-green-600 font-bold uppercase mt-2 tracking-widest animate-pulse">
                            Tap to start logging expenses 💸
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Add_Members;