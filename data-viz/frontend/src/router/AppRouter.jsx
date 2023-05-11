import { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import Header from '../components/Header'
import { GlobalContext } from '../context/GlobalState'

// Pages
import PageNotFound from '../pages/PageNotFound'
import AdminTimeline from '../SingleComponents/AdminTimeline'
import UserTimeline from '../SingleComponents/UserTimeline'
import IntegrationDetails from '../pages/IntegrationDetails'
import RunDetails from '../pages/RunDetails'
import LandingPage from '../pages/LandingPage'

function AppRouter() {
  const { loggedUser } = useContext(GlobalContext)

  return (
    <BrowserRouter>
      <Nav />
      {/* <Header />  */}
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

      <Footer />
    </BrowserRouter>
  )
}
export default AppRouter
