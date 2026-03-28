import React, { useEffect, useState } from 'react'

function Signup({usernames}) {
    const [field, setField] = useState({
        username: "",
        nickname: ""
    })
    function HandleSubmit(e){
        e.preventDefault();
        return field.username === "" || field.nickname === "" ? alert("Please fill all the fields") : usernames.includes(field.username) ? alert("Username already exists") : alert("Username is available")
    }
    return (
        <div>
            <h1>New Account?</h1>
            <form>
                <div>
                    <label htmlFor="username">Username</label>
                    <input value={field.username} onChange={(e)=>setField({...field, username: e.target.value})} type='text' placeholder='Username' id='username' />
                </div>
                <div>
                    <label htmlFor="nickname">Nickname</label>
                    <input value={field.nickname} onChange={(e)=>setField({...field, nickname: e.target.value})} type='text' placeholder='Nickname' id='nickname' />
                </div>
                <div>
                    <a href="#">Already have an Account?</a>
                </div>
                <button onClick={HandleSubmit} type='submit'>Create Account</button>
            </form>
        </div>
    )
}

export default Signup