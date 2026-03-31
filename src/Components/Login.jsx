import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router'; 
import { useUser } from '../UserContext'; 
import Cookies from 'js-cookie';

function Login() {
    const navigate = useNavigate();
    
    const { user, setUser, usernames, tripDetails } = useUser(); 
    
    const [field, setField] = useState({
        username: ""
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

    function HandleSubmit(e) {
        e.preventDefault();
        if (field.username === "") return alert("Please enter the username 🛑");

        if (usernames.includes(field.username)) {
            setUser(field.username);
            Cookies.set("username", field.username, { expires: 7 });
            navigate("/add-members");
        } else {
            alert("No user Found 🤷‍♂️");
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-[40%] h-[40%] flex justify-center items-center flex-col'>
                <div className='w-[70%] h-full bg-white small-box-shadow rounded-4xl flex justify-center items-center flex-col'>

                    <h1 className='text-2xl font-["Syne"] mb-4 font-extrabold'>Login 🔐</h1>
                    
                    <form onSubmit={HandleSubmit} className='h-[70%] w-[80%] flex justify-around items-center flex-col'>
                        <div className='flex h-[30%] w-full justify-center items-start flex-col'>
                            <input 
                                value={field.username} 
                                onChange={(e)=>setField({...field, username: e.target.value})} 
                                type="text" 
                                placeholder='Username 👤' 
                                id='username' 
                                className='pl-6 h-[80%] w-full bg-white border-none outline-none small-box-shadow rounded-4xl flex justify-center items-center flex-col focus:ring-2 focus:ring-[#C599B6] transition-all' 
                            />
                            <div className='flex h-[25%] w-full justify-center items-end flex-col text-[12px] cursor-pointer mt-2'>
                                <Link to="/" className="text-gray-500 hover:text-[#C599B6] transition-colors font-semibold">
                                    Don't have an Account? 🤔
                                </Link>
                            </div>
                        </div>
                        <button 
                            type='submit' 
                            className='small-box-shadow p-3 px-12 bg-black text-white rounded-4xl font-bold mt-4 hover:scale-105 active:scale-95 transition-transform'
                        >
                            Login 🚀
                        </button>
                    </form>
                    
                </div>
            </div>
            
            <div className='w-[60%] h-full flex justify-center items-center relative'>
                <img 
                    src="/BGlogin.svg" 
                    alt="background" 
                    className='h-full -scale-x-100 '
                />
                <div className="absolute right-[40%] top-[30%]">
                    <h1 className='text-3xl font-bold mb-2'>Welcome to 🎉</h1>
                    <h1 className='text-5xl font-["Syne"] font-extrabold '>ContriZee</h1>
                </div>
            </div>
        </div>
    );
}

export default Login;