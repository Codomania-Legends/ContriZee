import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router'; // or 'react-router-dom'
import { ref, set } from 'firebase/database';
import { db } from '../firebase'; // Bring in your centralized db config! 🔥
import { useUser } from '../UserContext'; // 🪄 Import Context

function Signup() {
    const navigate = useNavigate();
    
    // 1. Pull what you need directly from the Context! 📥
    const { user, setUser, usernames } = useUser();

    const [field, setField] = useState({
        username: "",
        nickname: ""
    });

    // Automatically send them to the app if they already have an active session! 🔀
    useEffect(() => {
        if (user) {
            navigate("/add-members");
        }
    }, [user, navigate]);

    const dataSet = () => {
        // Cleaned up the Firebase 9 modular syntax! 🧹
        set(ref(db, `users/${field.username}`), {
            username: field.username,
            nickname: field.nickname
        }).catch((error) => {
            console.error("Firebase Error: ", error);
        });
    };

    function HandleSubmit(e) {
        e.preventDefault();
        
        if (field.username === "" || field.nickname === "") {
            return alert("Please fill all the fields 🛑");
        } else if (usernames.includes(field.username)) {
            return alert("Username already exists 🤷‍♂️");
        } else {
            dataSet(); 
            setUser(field.username);
            // Added path=/ so the cookie is valid across all routes! 🍪
            document.cookie = `username=${field.username}; path=/; max-age=86400`; 
            navigate("/add-members");
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-[60%] h-full flex justify-center items-center'>
                <img src="/BGlogin.svg" alt="background" className='h-full'/>
                <h1 className='absolute left-[25%] top-[30%] text-3xl font-bold'>Welcome to 🎉</h1>
                <h1 className='absolute left-[25%] top-[35%] text-4xl font-["Syne"] font-extrabold'>ContriZee</h1>
            </div>
            
            <div className='w-[40%] h-[50%] flex justify-center items-center flex-col'>
                <div className='w-[70%] h-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col'>
                    <h1 className='text-2xl font-["Syne"] mb-4 font-extrabold'>New Account? ✨</h1>
                    
                    {/* Moved HandleSubmit to the form's onSubmit! ⌨️ */}
                    <form onSubmit={HandleSubmit} className='h-[70%] w-[80%] flex justify-around items-center flex-col'>
                        <div className='flex h-[20%] w-full justify-center items-start flex-col'>
                            {/* <label htmlFor="username">Username</label> */}
                            <input 
                                value={field.username} 
                                onChange={(e) => setField({...field, username: e.target.value})} 
                                type='text' 
                                placeholder='Username' 
                                id='username'
                                className='pl-6 h-[80%] w-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col outline-none focus:ring-2 focus:ring-pink-300' 
                            />
                        </div>
                        
                        <div className='flex h-[25%] w-full justify-center items-start flex-col'>
                            {/* <label htmlFor="nickname">Nickname</label> */}
                            <input 
                                value={field.nickname} 
                                onChange={(e) => setField({...field, nickname: e.target.value})} 
                                type='text' 
                                className='pl-6 h-[70%] w-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col outline-none focus:ring-2 focus:ring-pink-300'
                                placeholder='Nickname' 
                                id='nickname' 
                            />
                            
                            <div className='w-full flex cursor-pointer justify-center text-[12px] items-end flex-col'>
                                {/* Upgraded to React Router's Link tag! 🔗 */}
                                <Link to="/login" className="hover:text-pink-500 transition-colors">
                                    Already have an Account?
                                </Link>
                            </div>
                        </div>
                        
                        <button type='submit' className='small-box-shadow p-3 px-12 black text-white rounded-4xl hover:scale-105 active:scale-95 transition-transform'>
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;