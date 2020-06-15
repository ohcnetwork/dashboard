import React, {useState} from 'react';
import {navigate} from 'hookrouter';

import {login} from '../utils/api';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = () => {
        login({username,password}).then((response) => {     
            console.log("Completed Request")       
            localStorage.setItem("care_access_token", response.access);
            localStorage.setItem("care_refresh_token", response.refresh);
            navigate("/");
        }).catch((ex)=>{
            console.error("Couldn't Login",ex);
        })
    }
    return (
            <div className="flex items-center justify-center flex-1">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 flex max-w-xl flex-col ">
                <div className="mb-4">
                <label className="block text-grey-darker text-sm font-bold mb-2" for="username">
                    Username
                </label>
                <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" 
                    id="username" 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />
                </div>
                <div className="mb-6">
                <label className="block text-grey-darker text-sm font-bold mb-2" for="password">
                    Password
                </label>
                <input 
                    className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" 
                    id="password" 
                    type="password" 
                    placeholder="******************"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)} />
                <p className="text-red text-xs italic">Please choose a password.</p>
                </div>
                <div className="flex items-center justify-center">
                <button 
                    className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" 
                    type="button"
                    onClick={handleSubmit}>
                    Sign In
                </button>
                </div>
            </div>
        </div>
    )
}