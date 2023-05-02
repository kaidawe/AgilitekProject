import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState.jsx";

// import { Link } from 'react-router-dom';
import React from "react";
import '../styles/Header.css';

export default function Header() {
    const prop = useContext(GlobalContext);
    const [users, setUsers] = useState("");

    useEffect(() => {
        if (prop.customers.length > 0)
            setUsers(prop.customers);
        
        return () => {
            setUsers("");
        }
    }, [prop]);


    return (
        <nav className="header">
            <div className="text-center pt-8">

                { !users || !users.length
                    ? <p className='text-center font-bold text-gray-300 text-2xl'>Getting Users...</p>
                    :
                        <div>
                            <label htmlFor="integration-filter" className="font-bold mr-2">You are logged as:</label>
                            <select
                                id="customer-button"
                                value={prop.loggedUser}
                                onChange={prop.setLoggedUser}
                                className="px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                { users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                }
            </div>
        </nav>
    );
}