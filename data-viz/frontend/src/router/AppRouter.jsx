// AppRouter
// Router Components
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import Header from '../components/Header'

// Pages
import { AdminDash } from '../pages/AdminDash'
import { UserDash } from '../pages/UserDash'
import PageNotFound from '../pages/PageNotFound'
import TabNavigation from '../SingleComponents/TabNavigation'
import Integrations from '../SingleComponents/Integrations'
import Timeline from '../SingleComponents/Timeline'
import RunSchedule from '../SingleComponents/RunSchedule'

// tem data
import RSL from "../pages/TempDataRSL.jsx";
import Admin from "../pages/TempDataAdmin.jsx";
import Ducks from "../pages/TempDataDucks.jsx";
import MuiTimeline from '../SingleComponents/MuiTimelineTony'


// import { GlobalProvider } from "../context/GlobalState";
// not being used atm

function AppRouter() {
  return (
    // <GlobalProvider>
    <BrowserRouter>
      <Nav />
      <Header />
      <main>
        <Routes>
          <Route path="/" exact element={<UserDash />} />
          <Route path="/admin" exact element={<AdminDash />} />

          {/* routes for temp data*/}
          <Route path="/rsl" exact element={<RSL />} />
          <Route path="/general" exact element={<Admin />} />
          <Route path="/ducks" exact element={<Ducks />} />
          
          <Route path="/tabNavigation" exact element={<TabNavigation />} />
          <Route path="/integrations" exact element={<Integrations />} />
          <Route path="/timeline" exact element={<Timeline />} />
          <Route path="/runschedule" exact element={<RunSchedule />} />
          
          <Route path="/muitimeline" element={<MuiTimeline />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>

    /* </GlobalProvider> */
  )
}

export default AppRouter
