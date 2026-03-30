import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router' // or react-router-dom
import Select_Expense from './Components/Select_Expense'
import Expense_Summary from './Components/Expense_Summary'
import Settlement from './Components/Settlement.jsx'
import Signup from './Components/Signup.jsx'
import Login from './Components/Login.jsx'
import { UserProvider, useUser } from './UserContext.jsx' // <-- Import Provider
import { Toaster } from 'sileo'
import 'sileo/styles.css'
import { WhoPaysNext } from './Utility/Help.jsx'

const HomeLayout = () => {
  return (
  <div className='home-main-container'>
    <img src="/Background.svg" alt="Background" className='bgImg' />
    <Outlet />
  </div>
)};

const Layout = () => {
  const {members, expenses} = useUser()
  return (
  <div className='main-container'>
    <Outlet />
    <button className='absolute left-0 top-0 small-box-shadow bg-black text-white rounded-full px-4 py-2' onClick={() => {WhoPaysNext(members, expenses)}}>Who Pays Next?</button>
  </div>
)};

const Root = () => {
  return (
    <UserProvider>
      <Toaster
        position="top-center"
        options={{
          fill: "#171717",
          roundness: 16,
          styles: {
            title: "text-white!",
            description: "text-white/75!",
            badge: "bg-white/10!",
            button: "bg-white/10! hover:bg-white/15!",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route element={<HomeLayout />}>
            {/* Look at how clean these routes are now! */}
            <Route path='/' element={<Signup />} />
            <Route path='/login' element={<Login />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/add-members" element={<App />} />
            <Route path="/select-expense" element={<Select_Expense />} />
            <Route path="/expense-summary" element={<Expense_Summary />} />
            <Route path="/settle-debts" element={<Settlement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);