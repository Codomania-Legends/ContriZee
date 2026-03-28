import React, { useState } from 'react'
import { Link } from 'react-router';

function Trip_Details({ members }) { // Received members from Parent
    const [tripName, setTripName] = useState("");
    const [tripDate, setTripDate] = useState("");
    
    // This state stores the final "Trip Object"
    const [savedTrip, setSavedTrip] = useState(null);

    const handleSaveTrip = () => {
        if (tripName && tripDate) {
            const newTrip = {
                id: Date.now(),
                name: tripName,
                date: tripDate,
                participants: members
            };
            setSavedTrip(newTrip);
            alert(`Trip to ${tripName} saved successfully!`);
        } else {
            alert("Please fill in both the Trip Name and Date.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 space-y-8">
            {/* 1. Member Preview Section */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-600 uppercase mb-3">Trip Members</h3>
                <div className="flex flex-wrap gap-2">
                    {members.length > 0 ? (
                        members.map((m) => (
                            <span key={m.id} className="bg-white px-3 py-1 rounded-full text-sm shadow-sm border border-blue-200">
                                {m.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs italic">No members added yet...</span>
                    )}
                </div>
            </div>

            {/* 2. Trip Info Inputs */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Trip Details 🎒</h2>
                
                <div className="flex flex-col gap-4">
                    <input 
                        type="text"
                        value={tripName}
                        onChange={(e) => setTripName(e.target.value)}
                        placeholder="Where are you going? (e.g. Goa)"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    
                    <input 
                        type="date"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <button 
                        onClick={handleSaveTrip} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors shadow-md"
                    >
                        Confirm Trip
                    </button>
                </div>
            </div>

            {savedTrip && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    <strong>Confirmed:</strong> {savedTrip.name} on {savedTrip.date} with {savedTrip.participants.length} friends.
                </div>
            )}
        </div>
    )
}

export default Trip_Details