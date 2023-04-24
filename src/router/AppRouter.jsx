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
import Data from "../pages/TempData.jsx";
import TabNavigation from "../SingleComponents/TabNavigation";
import Timeline from "../SingleComponents/Timeline";

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
            <Route path="/data" exact element={<Data />} />
            <Route path="/tabNavigation" exact element={<TabNavigation />} />
            <Route path="/timeline" exact element={<Timeline />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>

        </main>

        <Footer />
      </BrowserRouter>
    /* </GlobalProvider> */
  );
}

export default AppRouter;
