// AppRouter
// Router Components
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Footer  from "../components/Footer";
import Nav from "../components/Nav";

// Pages
import { AdminDash } from "../pages/AdminDash";
import { UserDash } from "../pages/UserDash";
import PageNotFound from "../pages/PageNotFound";

// import { GlobalProvider } from "../context/GlobalState";
// not being used atm


function AppRouter() {
  return (
    // <GlobalProvider>
      <BrowserRouter>
        <Nav />
        <main >
         
          <Routes>
            <Route path="/" exact element={<UserDash />} />
            <Route path="/admin" exact element={<AdminDash />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>

        </main>

        <Footer />
      </BrowserRouter>
    /* </GlobalProvider> */
  );
}

export default AppRouter;
