import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router' // or react-router-dom
import Add_Members from './Components/Add_Members'
import Select_Expense from './Components/Select_Expense'
import Expense_Summary from './Components/Expense_Summary'
import Settlement from './Components/Settlement.jsx'
import Signup from './Components/Signup.jsx'
import Login from './Components/Login.jsx'
import { UserProvider } from './UserContext.jsx' // <-- Import Provider

const HomeLayout = () => (
  <div className='home-main-container'>
    <img src="/Background.svg" alt="Background" className='bgImg' />
    <Outlet />
  </div>
);

const Root = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<HomeLayout />}>
            {/* Look at how clean these routes are now! */}
            <Route path='/' element={<Signup />} />
            <Route path='/login' element={<Login />} />
          </Route>
          <Route path="/add-members" element={<App />} />
          <Route path="/select-expense" element={<Select_Expense />} />
          <Route path="/expense-summary" element={<Expense_Summary />} />
          <Route path="/settle-debts" element={<Settlement />} />
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