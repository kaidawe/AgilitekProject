// AppRouter
// Router Components
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import Header from '../components/Header'
import { GlobalProvider } from '../context/GlobalState'

// Pages
import PageNotFound from '../pages/PageNotFound'
import IntegrationDetails from '../pages/IntegrationDetails'
import AdminTimeline from '../pages/AdminTimeline'
import UserTimeline from '../pages/UserTimeline'
import RunDetails from '../pages/RunDetails'

// const integrationId = "INTEGRATION#01G2AQ9H975ZJ54YHQDTC74J5X";
const runIdToFind = 'RUN#1679681497'

function AppRouter() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Nav />
        <Header />
        <main>
          <Routes>
            <Route path="/" exact element={<AdminTimeline />} />
            <Route path="/timeline" exact element={<AdminTimeline />} />
            <Route path="/user-timeline" exact element={<UserTimeline />} />
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
    </GlobalProvider>
  )
}
export default AppRouter
