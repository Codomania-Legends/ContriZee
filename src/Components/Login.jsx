import React, { useState } from 'react'

function Login({usernames}) {
    const [field, setField] = useState({
        username: ""
    })
    function HandleSubmit(e){
        e.preventDefault();
        return field.username === "" ? alert("Please enter the username") : usernames.includes(field.username) ? alert("Login Successfull") : alert("No user Found")
    }
    return (
        <div>
            <h1>Login</h1>
            <form>
                <div>
                    <label htmlFor="username">Username</label>
                    <input value={field.username} onChange={(e)=>setField({...field, username: e.target.value})} type="text" placeholder='Username' id='username' />
                </div>
                <div>
                    <a href="#">Don't have an Account?</a>
                </div>
                <button onClick={HandleSubmit} type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login