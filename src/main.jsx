import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router' 
import Select_Expense from './Components/Select_Expense'
import Expense_Summary from './Components/Expense_Summary'
import Settlement from './Components/Settlement.jsx'
import Signup from './Components/Signup.jsx'
import Login from './Components/Login.jsx'
import { UserProvider, useUser } from './UserContext.jsx' 
import { sileo, Toaster } from 'sileo'
import 'sileo/styles.css'
import { WhoPaysNext } from './Utility/Help.jsx'
import { OpenRouter } from '@openrouter/sdk';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Imported Framer Motion 🎬✨

const HomeLayout = () => {
  return (
        <div className='home-main-container'>
          {/* Added a slow zoom-in animation for the background 🖼️🔍 */}
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/Background.svg" 
            alt="Background" 
            className='bgImg' 
          />
          {/* Added a smooth slide-up and fade-in for the auth components 🚀⬆️ */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </div>
)};

const Layout = ({openRouter}) => {
  const {members, expenses} = useUser()

  return (
    <div className='main-container'>
      {/* Smooth fade-in for the main app pages 🌟👀 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.div>
      
      {/* Added bouncy hover and tap animations to the AI button! 🔘🎈 */}
      <motion.button 
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className='md:left-10 left-25 fixed md:bottom-5 bottom-25 small-box-shadow bg-[#C8A2C8] text-white rounded-full px-4 py-2' 
        onClick={() => {
          sileo.promise(WhoPaysNext(members, expenses, openRouter), {
            loading: {
              title: "Analyzing...",
              description: "Asking the AI oracle... 🤖🔮",
            },
            success: (data) => ({
              title: "From my Analysis...",
              description: data, 
              type: "success",
            }),
            error: {
              title: "Error",
              description: "Something went wrong with the AI. 🚨💔",
            }
          });
        }}>
          Who Pays Next? 🤔💸
      </motion.button>
    </div>
)};

const Root = () => {
  console.log(import.meta.env.VITE_OPENROUTER_API_KEY)
  const openRouter = new OpenRouter({
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  });
  
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
            <Route path='/' element={<Signup />} />
            <Route path='/login' element={<Login />} />
          </Route>
          <Route element={<Layout openRouter={openRouter}/>}>
            <Route path="/add-members" element={<App />} />
            <Route path="/select-expense" element={<Select_Expense />} />
            <Route path="/expense-summary" element={<Expense_Summary />} />
            <Route path="/settle-debts" element={<Settlement openRouter={openRouter} />} />
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