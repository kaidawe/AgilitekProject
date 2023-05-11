import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState.jsx'

// import { Link } from 'react-router-dom';
import React from 'react'
import '../styles/Header.css'

export default function Header() {
  const prop = useContext(GlobalContext)
  const [users, setUsers] = useState('')

  useEffect(() => {
    if (prop.customers.length > 0) {
      const userOptions = [
        { id: 0, name: 'Choose a user' },
        { id: 1, name: 'Administrator' },
      ]
      const allCustomers = prop.customers.map((customer, index) => ({
        id: index + userOptions.length,
        name: customer,
      }))
      setUsers([...userOptions, ...allCustomers])
    }

    return () => {
      setUsers('')
    }
  }, [prop])

  return (
    <nav className="header">
      <div className="text-center pt-8">
        {!users || !users.length ? (
          <p className="text-center font-bold text-gray-300 text-2xl">
            Getting Users...
          </p>
        ) : (
          <div>
            <label
              htmlFor="integration-filter"
              className="font-semibold mr-2 text-white"
            >
              You are logged in as:
            </label>
            <select
              id="customer-button"
              value={prop.loggedUser}
              onChange={prop.setLoggedUser}
              className="px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {users.map((user, index) => (
                <option key={index} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </nav>
  )
}
