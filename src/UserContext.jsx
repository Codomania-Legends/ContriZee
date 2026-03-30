import React, { createContext, useState, useEffect, useContext } from 'react';
import { ref, get, child, onValue } from 'firebase/database';
import { db } from './firebase.js';
import { sileo } from 'sileo'; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usernames, setUsernames] = useState([]);
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  // Changed currentTrip to activeTrip for better object handling
  const [tripDetails, setTripDetails] = useState({ allTrips: [], activeTrip: null });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find(row => row.trim().startsWith("username="));
    const tripCookie = cookies.find(row => row.trim().startsWith("activeTrip="));
    
    if (userCookie) {
        setUser(userCookie.split("=")[1]);
    }
    if(tripCookie){
        setTripDetails(prev => ({ ...prev, activeTrip: tripCookie.split("=")[1] }));
    }

    const fetchUsernames = async () => {
      const snapshot = await get(child(ref(db), `users`));
      if (snapshot.exists()) {
        setUsernames(Object.keys(snapshot.val()));
      }
      return snapshot;
    };

    sileo.promise(fetchUsernames(), {
      loading: { title: "Fetching users..." },
      success: { title: "Users loaded!" },
      error: { title: "Failed to load users" },
    }); 
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const userRef = ref(db, `users/${user}`);
      
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          if (data.trips) {
            // 1. Transform trips object into an array
            const tripsArray = Object.keys(data.trips).map(key => ({
                ...data.trips[key],
                firebaseKey: key
            }));

            setTripDetails(prev => {
              // 2. Figure out which trip is "Active"
              // Priority: Currently selected > First trip in list > null
              const newActive = prev.activeTrip 
                ? tripsArray.find(t => t.firebaseKey === prev.activeTrip.firebaseKey) || tripsArray[0]
                : tripsArray[0];

              // 3. Update the global members and expenses based on the ACTIVE trip 🎯
              if (newActive) {
                setMembers(newActive.members || []);
                
                if (newActive.expenses) {
                  const expensesArray = Object.keys(newActive.expenses).map(key => ({
                      ...newActive.expenses[key],
                      firebaseKey: key
                  }));
                  setExpenses(expensesArray);
                } else {
                  setExpenses([]);
                }
              }

              return { allTrips: tripsArray, activeTrip: newActive };
            });

          } else {
            // Reset if no trips exist
            setTripDetails({ allTrips: [], activeTrip: null });
            setMembers([]);
            setExpenses([]);
          }
        }
        setLoading(false); 
      }, (error) => {
        console.error(error);
        setLoading(false);
      });

      return () => unsubscribe(); 
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      user, setUser, usernames, setUsernames, 
      members, setMembers, expenses, setExpenses, loading, 
      tripDetails, setTripDetails
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);