import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState.jsx'

import '../styles/Nav.css'
import AgilitekLogo from '../img/agilitek-logo-96.png'

export default function Nav() {
  const navigate = useNavigate()
  const {
    loggedUser,
    setLoggedUser,
    setIntegrations,
    setRuns,
    setIntegrationsByCustomer,
    setRunsByIntegration,
  } = useContext(GlobalContext)

  const handleLogOut = (e) => {
    e.preventDefault()
    setLoggedUser('')
    setIntegrations([])
    setRuns([])
    setIntegrationsByCustomer([])
    setRunsByIntegration([])
    navigate('/')
  }

  return (
    <nav className="nav">
      <div className="navLogo">
        <Link to={loggedUser ? '/home' : '/'}>
          <img
            src={AgilitekLogo}
            className="p-2"
            alt="Agilitek"
            title="Agilitek"
          />
        </Link>
      </div>
      <ul className="listItems">
        {loggedUser && loggedUser !== 'Choose a user' ? (
          <li
            className="hover:cursor-pointer"
            onClick={(e) => {
              handleLogOut(e)
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </nav>
  )
}
