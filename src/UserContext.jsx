import React, { createContext, useState, useEffect, useContext } from 'react';
import { ref, get, child, onValue } from 'firebase/database';
import { db } from './firebase.js';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usernames, setUsernames] = useState([]);
  const [user, setUser] = useState(null);
  
  // These will now be synced directly with Firebase! ☁️
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]); // 👈 NEW: Global Expenses State!

  // 1. Fetch Usernames & Check Cookies on Load 🍪
  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find(row => row.trim().startsWith("username="));
    
    if (userCookie) {
        setUser(userCookie.split("=")[1]);
    }

    get(child(ref(db), `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUsernames(Object.keys(snapshot.val())); 
        }
      })
      .catch((error) => console.error("Firebase Error:", error));
  }, []);

  // 2. Real-time Firebase Sync for the Logged-in User! 📡🔥
  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user}`);
      
      // onValue listens for ANY changes to this user in Firebase 🎧
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          // Sync Members 🎒
          setMembers(data.members || []);
          
          // Sync Expenses (Firebase stores lists as objects, so we convert it to an array!) 💸
          if (data.expenses) {
             // Convert the object of push-IDs into an array of objects
             const expensesArray = Object.keys(data.expenses).map(key => ({
                 ...data.expenses[key],
                 firebaseKey: key // Keep the key just in case we need to delete it later! 🗑️
             }));
             setExpenses(expensesArray);
          } else {
             setExpenses([]);
          }
        }
      });

      // Cleanup listener when user logs out or component unmounts 🧹
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, usernames, setUsernames, members, setMembers, expenses, setExpenses }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);