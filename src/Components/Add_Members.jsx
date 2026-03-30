import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router'; 
import { useUser } from '../UserContext';
import { ref, set, push } from 'firebase/database';
import { db } from '../firebase';
import { sileo } from 'sileo';
import Cookies from 'js-cookie';

function Add_Members() {
    const { user, tripDetails, setTripDetails, setMembers } = useUser();
    const [tempName, setTempName] = useState("");
    const [trip_Name, setTrip_Name] = useState("");
    const navigate = useNavigate();

    // The trip we are currently editing
    const activeTrip = tripDetails?.activeTrip;
    const members = activeTrip?.members || [];

    // 1. Create a New Trip 🆕
    const addTrip = () => {
        if (!trip_Name.trim()) return;

        const tripListRef = ref(db, `users/${user}/trips`);
        const newTripRef = push(tripListRef);
        
        let name = "";
        if(user){
            name = user?.slice(0,1).toUpperCase().concat(user.slice(1));
        }
        
        const newTripData = {
            id: newTripRef.key,
            name: trip_Name,
            createdAt: Date.now(),
            members: [{ id: Date.now(), name: name }],
            expenses: {}
        };

        sileo.promise(set(newTripRef, newTripData), {
            loading: { title: "Creating Trip..." },
            success: { title: "Trip Created! 🎒" },
            error: { title: "Error creating trip" }
        }).then(() => {
            // Switch to the new trip immediately so the user can start adding friends!
            setTripDetails(prev => ({ ...prev, activeTrip: newTripData }));
        });

        setTrip_Name("");
    };

    // 2. Add Member to the ACTIVE trip 👥
    const addMember = () => {
        if (!activeTrip) {
            alert("Please create or select a trip first! 🛑");
            return;
        }

        if (tempName.trim()) {
            if(!members.some(m => m.name.toLowerCase() === tempName.trim().toLowerCase())) {
                const name = tempName.slice(0,1).toUpperCase().concat(tempName.slice(1));
                const updatedMembers = [...members, { id: Date.now(), name: name }];
                
                // Save to: users/anshul/trips/TRIP_ID/members
                set(ref(db, `users/${user}/trips/${activeTrip.id}/members`), updatedMembers);
                setTripDetails(prev => ({
                    ...prev,
                    activeTrip: {
                        ...prev.activeTrip,
                        members: updatedMembers
                    }
                }));
                setMembers(updatedMembers);
            }
            setTempName(""); 
        }
    };

    const removeMember = (id) => {
        const updatedMembers = members.filter((m) => m.id !== id);
        set(ref(db, `users/${user}/trips/${activeTrip.id}/members`), updatedMembers);
    };

    const canGoNext = members.length >= 2;

    return (
        <div className="min-h-screen pb-32">
            <div className='p-6 max-w-md mx-auto'>
                <h2 className="text-2xl font-bold mb-8">Create Your Trip 🎒</h2>
                
                <div className="flex flex-col gap-3 mb-10">
                    {tripDetails?.allTrips?.map((trip) => (
                        <button 
                            key={trip.id}
                            onClick={() => setTripDetails(prev => ({...prev, activeTrip: trip}))}
                            className={`p-4 small-box-shadow rounded-2xl text-left transition-all ${
                                activeTrip?.id === trip.id ? 'bg-[#C599B6] text-white' : 'bg-gray-100 text-black'
                            }`}
                        >
                            <p className="font-bold">{trip.name}</p>
                            <p className="text-xs opacity-60">{trip.members?.length || 0} Members</p>
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input 
                        value={trip_Name}
                        onChange={(e) => setTrip_Name(e.target.value)}
                        placeholder="New Trip Name (e.g. Goa 2026)"
                        className="flex-1 px-4 border border-gray-300 py-3 outline-none rounded-lg"
                    />
                    <button className="text-white px-4 py-3 small-box-shadow bg-[#C599B6] rounded-lg font-bold" onClick={addTrip}>Create</button>
                </div>
            </div>

            {activeTrip && (
                <div className="p-6 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-bold mb-4">Adding to: {activeTrip.name} 👥</h2>
                    
                    <div className="flex gap-2 mb-6">
                        <input 
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addMember()}
                            placeholder="Friend's name..."
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none"
                        />
                        <button onClick={addMember} className="text-white px-4 py-3 small-box-shadow bg-[#C599B6] rounded-lg font-bold">Add</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {members.map((m) => (
                            <div key={m.id} className="flex items-center text-gray-500 smallest-box-shadow bg-white px-3 py-1.5 rounded-lg">
                                <span className="text-sm font-medium">{m.name}</span>
                                <button onClick={() => removeMember(m.id)} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation Button */}
            <div className="fixed flex justify-center items-center bottom-0 left-0 right-0 p-6">
                <button 
                    disabled={!canGoNext}
                    onClick={() => {
                        Cookies.set("activeTrip", trip_Name ? trip_Name : activeTrip.name, { expires: 7 });
                        console.log(Cookies.get("activeTrip"));
                        navigate("/select-expense")
                    }}
                    className={`w-[30%] py-4 rounded-2xl font-bold transition-all small-box-shadow ${
                        canGoNext ? 'bg-green-500 text-white' : 'bg-[#C599B6] text-white'
                    }`}
                >
                    {canGoNext ? "Start Splitting! →" : "Add at least 2 members"}
                </button>
            </div>
        </div>
    );
}

export default Add_Members;