import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router'; 
import { ref, set } from 'firebase/database';
import { db } from '../firebase'; 
import { useUser } from '../UserContext'; 
import Cookies from 'js-cookie';

function Signup() {
    const navigate = useNavigate();
    
    const { user, setUser, usernames, tripDetails } = useUser();

    const [field, setField] = useState({
        username: "",
        nickname: ""
    });

    useEffect(() => {
        if(user){
            if(tripDetails?.activeTrip){
                navigate("/select-expense");
            }else{
                navigate("/add-members");
            }
        }
    }, [user, navigate, tripDetails]);

    const dataSet = () => {
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
            Cookies.set("username", field.username, { expires: 7 });
            navigate("/add-members");
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-[60%] h-full flex justify-center items-center relative'>
                <img 
                    src="/BGlogin.svg" 
                    alt="background" 
                    className='h-full object-cover'
                />
                <div className="absolute left-[25%] top-[30%]">
                    <h1 className='text-3xl font-bold mb-2'>Welcome to 🎉</h1>
                    <h1 className='text-5xl font-["Syne"] font-extrabold text-[#C599B6] drop-shadow-lg'>ContriZee</h1>
                </div>
            </div>
            
            <div className='w-[40%] h-[50%] flex justify-center items-center flex-col'>
                <div className='w-[70%] h-full bg-white small-box-shadow rounded-4xl flex justify-center items-center flex-col'>
                    <h1 className='text-2xl font-["Syne"] mb-4 font-extrabold'>New Account? ✨</h1>
                    
                    <form onSubmit={HandleSubmit} className='h-[70%] w-[80%] flex justify-around items-center flex-col'>
                        <div className='flex h-[20%] w-full justify-center items-start flex-col'>
                            <input 
                                value={field.username} 
                                onChange={(e) => setField({...field, username: e.target.value})} 
                                type='text' 
                                placeholder='Username 👤' 
                                id='username'
                                className='pl-6 h-[80%] w-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col outline-none focus:ring-2 focus:ring-[#C599B6] transition-all' 
                            />
                        </div>
                        
                        <div className='flex h-[25%] w-full justify-center items-start flex-col'>
                            <input 
                                value={field.nickname} 
                                onChange={(e) => setField({...field, nickname: e.target.value})} 
                                type='text' 
                                className='pl-6 h-[70%] w-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col outline-none focus:ring-2 focus:ring-[#C599B6] transition-all'
                                placeholder='Nickname 🏷️' 
                                id='nickname' 
                            />
                            
                            <div className='w-full flex cursor-pointer justify-center text-[12px] items-end flex-col mt-2'>
                                <Link to="/login" className="text-gray-500 hover:text-[#C599B6] transition-colors font-semibold">
                                    Already have an Account? 🤔
                                </Link>
                            </div>
                        </div>
                        
                        <button 
                            type='submit' 
                            className='small-box-shadow p-3 px-12 bg-black text-white rounded-4xl font-bold mt-4 hover:scale-105 active:scale-95 transition-transform'
                        >
                            Create Account 🚀
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;