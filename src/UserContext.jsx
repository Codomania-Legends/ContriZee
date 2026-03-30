import React, { createContext, useState, useEffect, useContext } from 'react';
import { ref, get, child, onValue } from 'firebase/database';
import { db } from './firebase.js';
import { sileo } from 'sileo'; 
import Cookies from 'js-cookie';

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
    const userCookie = Cookies.get("username");
    const tripCookie = Cookies.get("activeTrip");
    
    if (userCookie) {
        setUser(userCookie);
    }
    if(tripCookie){
        console.log("context : trip cookie - ", tripCookie)
        setTripDetails(prev => ({ ...prev, activeTrip: tripCookie }));
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

            console.log("context : tripsArray - ", tripsArray);
            

            setTripDetails(prev => {
  // 1. Convert the Firebase object into an array
  const tripsArray = Object.keys(data.trips).map(key => ({
    ...data.trips[key],
    firebaseKey: key
  }));

  // 2. Determine what our "target" trip name is.
  // It's either the string from the cookie (prev.activeTrip) 
  // or the name property of the current activeTrip object.
  const targetTripName = typeof prev.activeTrip === 'string' 
    ? prev.activeTrip 
    : prev.activeTrip?.name;

  let newActive = null;

  if (targetTripName) {
    // 3. Match the trip name from the cookie to an object in the array
    newActive = tripsArray.find(t => t.name === targetTripName);
  }

  // 4. Default to the first trip ONLY if the cookie trip wasn't found
  if (!newActive) {
    newActive = tripsArray[0];
  }

  // 5. Update UI side-effects (Members and Expenses)
  if (newActive) {
    setMembers(newActive.members || []);
    const expensesArray = newActive.expenses 
      ? Object.keys(newActive.expenses).map(k => ({ ...newActive.expenses[k], firebaseKey: k }))
      : [];
    setExpenses(expensesArray);
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