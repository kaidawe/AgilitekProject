// Page - Not Found
import '../styles/PageNotFound.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  useEffect(() => {
    document.title = `Agilitek Data Viz - Page Not Found`
  }, [])

  return (
    <div className="bg-main-blue shadow rounded-lg p-4">
      <div class="container">
        <h1 className="errormsg">404 error</h1>
        <h2 className="heythere">
          Hey there!<br></br>
          Sorry, the page you are looking for could not be found.
        </h2>
        <Link to="/home">
          <button className="homebtn">Go home</button>
        </Link>
      </div>
    </div>
  )
}

export default PageNotFound
