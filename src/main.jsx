import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Trip_Details from './Components/Trip_Details'
import Add_Members from './Components/Add_Members'
import Select_Expense from './Components/Select_Expense'
import { useState } from 'react'
import Expense_Summary from './Components/Expense_Summary'
import Settlement from './Components/Settlement.jsx'

const Root = () => {
  const [members, setMembers] = useState([]); // Move state here

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App members={members} setMembers={setMembers} />} />
        <Route path="/select-expense" element={<Select_Expense members={members} />} />
        <Route path="/expense-summary" element={<Expense_Summary members={members} />} />
        <Route path="/settle-debts" element={<Settlement members={members} />} />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(<Root />);
