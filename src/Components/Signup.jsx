import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

function Signup({usernames}) {
    const navigate = useNavigate();
    const [field, setField] = useState({
        username: "",
        nickname: ""
    })
    function HandleSubmit(e){
        e.preventDefault();
        navigate("/add-members")
        alert("Account created successfully")
        return field.username === "" || field.nickname === "" ? alert("Please fill all the fields") : usernames.includes(field.username) ? alert("Username already exists") : alert("Username is available")
    }
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-[60%] h-full flex justify-center items-center'>
                <img src="/BGlogin.svg" alt="background" className='h-full'/>
                <h1 className='absolute left-[25%] top-[30%] text-3xl font-bold'>Welcome to </h1>
                <h1 className='absolute left-[25%] top-[35%] text-4xl font-["Syne"] font-extrabold'>ContriZee</h1>
            </div>
            <div className='w-[40%] h-[50%] flex justify-center items-center flex-col'>
                <div className='w-[70%] h-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col'>
                    <h1 className='text-2xl font-["Syne"] mb-4 font-extrabold'>New Account?</h1>
                    <form className='h-[70%] w-[80%] flex justify-around items-center flex-col'>
                        <div className='flex h-[20%] w-full justify-center items-start flex-col'>
                            {/* <label htmlFor="username">Username</label> */}
                            <input value={field.username} 
                            onChange={(e)=>setField({...field, username: e.target.value})} 
                            type='text' 
                            placeholder='Username' 
                            id='username'
                            className='pl-6 h-[80%] w-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col' />
                        </div>
                        <div className='flex h-[25%] w-full justify-center items-start flex-col'>
                            {/* <label htmlFor="nickname">Nickname</label> */}
                            <input value={field.nickname} 
                            onChange={(e)=>setField({...field, nickname: e.target.value})} 
                            type='text' 
                            className='pl-6 h-[70%] w-full white small-box-shadow rounded-4xl flex justify-center items-center flex-col'
                            placeholder='Nickname' 
                            id='nickname' />
                        <div className='w-full flex cursor-pointer justify-center text-[12px] items-end flex-col'>
                            <a href="/login">Already have an Account?</a>
                        </div>
                        </div>
                        <button onClick={HandleSubmit} type='submit' className='small-box-shadow p-3 px-12 black text-white rounded-4xl'>Create Account</button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Signup