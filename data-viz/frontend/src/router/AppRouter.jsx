import { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import Nav from '../components/Nav'
import { GlobalContext } from '../context/GlobalState'

// Pages
import PageNotFound from '../pages/PageNotFound'
import IntegrationDetails from '../pages/IntegrationDetails'
import AdminTimeline from '../pages/AdminTimeline'
import UserTimeline from '../pages/UserTimeline'
import RunDetails from '../pages/RunDetails'
import LandingPage from '../pages/LandingPage'

function AppRouter() {
  const { loggedUser } = useContext(GlobalContext)

  return (
    <BrowserRouter>
      <Nav />
      <main>
        <Routes>
          <Route path="/" exact element={<LandingPage />} />
          {loggedUser === 'Administrator' ? (
            <>
              <Route path="/home" exact element={<AdminTimeline />} />
            </>
          ) : (
            <>
              <Route path="/home" exact element={<UserTimeline />} />
            </>
          )}

          <Route path="/rundetails/:runId" exact element={<RunDetails />} />
          <Route
            path="/integrationDetails/:integrationId"
            exact
            element={<IntegrationDetails />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
export default AppRouter
