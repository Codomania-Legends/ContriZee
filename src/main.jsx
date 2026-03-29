import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router'
import Add_Members from './Components/Add_Members'
import Select_Expense from './Components/Select_Expense'
import { useState } from 'react'
import Expense_Summary from './Components/Expense_Summary'
import Settlement from './Components/Settlement.jsx'
import Signup from './Components/Signup.jsx'
import Login from './Components/Login.jsx'
import { ref, get, child, push } from 'firebase/database';
import { db } from './firebase.js'

const Root = () => {
  const [usernames, setUsernames] = useState([]);
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find(row => row.trim().startsWith("username="));
    
    if (userCookie) {
        const cookieValue = userCookie.split("=")[1];
        setUser(cookieValue);
    }
    get(child(ref(db), `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userList = snapshot.val();
          for (const element in userList) {
            setUsernames(prev => [...prev, element])
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Firebase Error:", error);
      });
  }, []);


  const HomeLayout = () => (
    <div className='home-main-container'>
      <img src="/Background.svg" alt="Background" className='bgImg' />
      <Outlet />
    </div>
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path='/' element={ <Signup setUser={setUser} usernames={usernames}/> }/>
          <Route path='/login' element={ <Login setUser={setUser} usernames={usernames}/> }/>
        </Route>
        <Route path="/add-members" element={<App user={user} members={members} setMembers={setMembers} />} />
        <Route path="/select-expense" element={<Select_Expense user={user} members={members} />} />
        <Route path="/expense-summary" element={<Expense_Summary user={user} members={members} />} />
        <Route path="/settle-debts" element={<Settlement user={user} members={members} />} />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(<Root />);
