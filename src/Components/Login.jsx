import React, { useState } from 'react'
import { useNavigate } from 'react-router'

function Login({usernames}) {
    const navigate = useNavigate();
    const [field, setField] = useState({
        username: ""
    })
    function HandleSubmit(e){
        e.preventDefault();
        navigate("/add-members");
        alert("Login Successfull")
        return field.username === "" ? alert("Please enter the username") : usernames.includes(field.username) ? alert("Login Successfull") : alert("No user Found")
    }
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-[40%] h-[40%] flex justify-center items-center flex-col'>
                <div className='w-[70%] h-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col'>

                    <h1 className='text-2xl font-["Syne"] mb-4 font-extrabold'>Login</h1>
                    <form className='h-[70%] w-[80%] flex justify-around items-center flex-col'>
                        <div className='flex h-[30%] w-full justify-center items-start flex-col'>
                            {/* <label htmlFor="username">Username</label> */}
                            <input value={field.username} onChange={(e)=>setField({...field, username: e.target.value})} type="text" placeholder='Username' id='username' 
                            className='pl-6 h-[80%] w-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col' />
                        <div className='flex h-[25%] w-full justify-center items-end flex-col text-[12px] cursor-pointer'>
                            <a href="/">Don't have an Account?</a>
                        </div>
                        </div>
                        <button onClick={HandleSubmit} type='submit' className='small-box-shadow p-3 px-12 black text-white rounded-4xl'>Login</button>
                    </form>
                </div>
            </div>
            <div className='w-[60%] h-full flex justify-center items-center'>
                <img src="/BGlogin.svg" alt="background" className='h-full -scale-x-100'/>
                <h1 className='absolute right-[25%] top-[30%] text-3xl font-bold'>Welcome to </h1>
                <h1 className='absolute right-[25%] top-[35%] text-4xl font-bold font-["Syne"] font-extrabold'>ContriZee</h1>
            </div>
        </div>
    )
}

export default Login