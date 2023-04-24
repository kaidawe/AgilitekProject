// AppRouter
// Router Components
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Footer  from "../components/Footer";
import Nav from "../components/Nav";
import Header from "../components/Header";

// Pages
import { AdminDash } from "../pages/AdminDash";
import { UserDash } from "../pages/UserDash";
import PageNotFound from "../pages/PageNotFound";
import TabNavigation from "../SingleComponents/TabNavigation";

// tem data
import RSL from "../pages/TempDataRSL.jsx";
import Admin from "../pages/TempDataAdmin.jsx";
import Ducks from "../pages/TempDataDucks.jsx";

// import { GlobalProvider } from "../context/GlobalState";
// not being used atm


function AppRouter() {
  return (
    // <GlobalProvider>
      <BrowserRouter>
        <Nav />
        <Header />
        <main >
         
          <Routes>
            <Route path="/" exact element={<UserDash />} />
            <Route path="/admin" exact element={<AdminDash />} />
            <Route path="/tabNavigation" exact element={<TabNavigation />} />

            {/* routes for temp data*/}
            <Route path="/rsl" exact element={<RSL />} />
            <Route path="/general" exact element={<Admin />} />
            <Route path="/ducks" exact element={<Ducks />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>

        </main>

        <Footer />
      </BrowserRouter>
    /* </GlobalProvider> */
  );
}

export default AppRouter;
