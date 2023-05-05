// AppRouter
// Router Components
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Header from "../components/Header";
import { GlobalProvider } from "../context/GlobalState";

// Pages
import { AdminDash } from "../pages/AdminDash";
import { UserDash } from "../pages/UserDash";
import PageNotFound from "../pages/PageNotFound";
import TabNavigation from "../SingleComponents/TabNavigation";
import Integrations from "../SingleComponents/Integrations";
import Timeline from "../SingleComponents/Timeline";
import RunSchedule from "../SingleComponents/RunSchedule";

// tem data
import RSL from "../pages/TempDataRSL.jsx";
import Admin from "../pages/TempDataAdmin.jsx";
import Ducks from "../pages/TempDataDucks.jsx";
import MuiTimeline from "../SingleComponents/MuiTimeline.jsx";
// import IntegrationTimeline from "../SingleComponents/IntegrationTimeline";
// import IntegrationRuntimeChart from "../SingleComponents/IntegrationRuntimeChart";
import IntegrationDetails from "../SingleComponents/IntegrationDetails";
// import MuiTimeline2 from '../SingleComponents/MuiTimelineTony.jsx';

// import { GlobalProvider } from "../context/GlobalState";
// not being used atm

function AppRouter() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Nav />
        <Header />
        <main>
          <Routes>
            <Route path="/" exact element={<UserDash />} />
            <Route path="/admin" exact element={<AdminDash />} />
            <Route path="/muitimeline" exact element={<MuiTimeline />} /> {/************* temp route */}
            {/* <Route path="/integrationDetails" exact element={<IntegrationTimeline />} /> */}
            {/* <Route path="/integrationRuntimeChart" exact element={<IntegrationRuntimeChart />} /> */}
            <Route path="/integrationDetails1" exact element={<IntegrationDetails />} />

            
            {/* <Route path="/rsl" exact element={<RSL />} />
            <Route path="/general" exact element={<Admin />} />
            <Route path="/test" exact element={<MyComponent />} />
            */}
            {/* <Route path="/muitimeline2" exact element={<MuiTimeline2 />} /> */}
            {/* <Route path="/tabNavigation" exact element={<TabNavigation />} />
            <Route path="/integrations" exact element={<Integrations />} />
            <Route path="/timeline" exact element={<Timeline />} />
            <Route path="/runschedule" exact element={<RunSchedule />} />
            <Route path="*" element={<PageNotFound />} /> */}
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default AppRouter;