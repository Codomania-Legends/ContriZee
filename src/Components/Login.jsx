import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router'; // or 'react-router-dom' depending on your setup
import { useUser } from '../UserContext'; // Make sure this path matches where you saved UserContext.jsx
import Cookies from 'js-cookie';

function Login() {
    const navigate = useNavigate();
    
    // 1. Pull what you need directly from the Context! 🪄
    const { user, setUser, usernames, tripDetails } = useUser(); 
    
    const [field, setField] = useState({
        username: ""
    });

    useEffect(() => {
        console.log("user", user);
        // If the user is already logged in (via Context/Cookie), send them straight in! 🏃‍♂️
        if(user){
            console.log("Got TripDetails : ",tripDetails)
            if(tripDetails?.activeTrip){
                navigate("/select-expenses");
            }else{
                navigate("/add-members");
            }
        }
    }, [user, navigate, tripDetails]);

    function HandleSubmit(e) {
        e.preventDefault();
        if (field.username === "") return alert("Please enter the username 🛑");

        if (usernames.includes(field.username)) {
            setUser(field.username);
            // FIX: Added path=/ and ensured this runs only on success 🍪
            // document.cookie = `username=${field.username}; path=/; max-age=86400`; 
            Cookies.set("username", field.username, { expires: 7 });
            navigate("/add-members");
        } else {
            alert("No user Found 🤷‍♂️");
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-[40%] h-[40%] flex justify-center items-center flex-col'>
                <div className='w-[70%] h-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col'>

                    <h1 className='text-2xl font-["Syne"] mb-4 font-extrabold'>Login 🔐</h1>
                    
                    <form onSubmit={HandleSubmit} className='h-[70%] w-[80%] flex justify-around items-center flex-col'>
                        <div className='flex h-[30%] w-full justify-center items-start flex-col'>
                            {/* <label htmlFor="username">Username</label> */}
                            <input 
                                value={field.username} 
                                onChange={(e)=>setField({...field, username: e.target.value})} 
                                type="text" 
                                placeholder='Username' 
                                id='username' 
                                className='pl-6 h-[80%] w-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col' 
                            />
                            <div className='flex h-[25%] w-full justify-center items-end flex-col text-[12px] cursor-pointer'>
                                {/* Swapped 'a' tag for 'Link' for better React routing! 🔗 */}
                                <Link to="/">Don't have an Account?</Link>
                            </div>
                        </div>
                        <button type='submit' className='small-box-shadow p-3 px-12 black text-white rounded-4xl'>
                            Login
                        </button>
                    </form>
                    
                </div>
            </div>
            
            <div className='w-[60%] h-full flex justify-center items-center'>
                <img src="/BGlogin.svg" alt="background" className='h-full -scale-x-100'/>
                <h1 className='absolute right-[25%] top-[30%] text-3xl font-bold'>Welcome to 🎉</h1>
                <h1 className='absolute right-[25%] top-[35%] text-4xl font-["Syne"] font-extrabold'>ContriZee</h1>
            </div>
        </div>
    );
}

export default Login;