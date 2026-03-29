import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getDatabase, ref, set, child } from 'firebase/database';

function Signup({usernames, setUser}) {
    const navigate = useNavigate();
    const [field, setField] = useState({
        username: "",
        nickname: ""
    })
    const dataSet = () => {
        const dbRef = ref(getDatabase());
        set(child(dbRef, `users/${field.username}`), {
            username: field.username,
            nickname: field.nickname
        })
    }
    function HandleSubmit(e){
        e.preventDefault();
        console.log("usernames", usernames)
        if( field.username === "" || field.nickname === "" ) return alert("Please fill all the fields")
        else if( usernames.includes(field.username) ) return alert("Username already exists")
        else dataSet() 
        setUser(field.username)
        document.cookie = `username=${field.username}`
        navigate("/add-members")           
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