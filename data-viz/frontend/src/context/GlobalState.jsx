import React, { createContext, useReducer, useEffect, useState } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";
import { customersAPI, integrationsAPI, allIntegrationsAPI, runsAPI, allRunsFromAllIntegrationsAPI } from "../globals/globals.jsx";


// queries all customer in DB
const grabAllRunsFromAllIntegrations = async integrations => {
    const url = allRunsFromAllIntegrationsAPI;
console.log("URLLLLLLLLLLLLLLLLLLLLLLLLLLLLL ", url, integrations)
    try {
        const { data } = await axios({
            url,
            params: {
                integrations: integrations.toString(),
                days: 7
            },
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        // console.log("RUNNSSSSSSSSSSSSS ---------------- ", data)
        return data;
    } catch (error) {
        const errorMessage = error.message || error || "Problem getting customers";
        console.log(`###ERROR: ${errorMessage}`);
        return { message: errorMessage };
    }
};


// queries all customer in DB
const grabAllIntegrations = async customers => {
    const url = allIntegrationsAPI;

    try {
        const { data } = await axios({
            url,
            params: {customers: customers.toString()},
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        return data;
    } catch (error) {
        const errorMessage = error.message || error || "Problem getting customers";
        console.log(`###ERROR: ${errorMessage}`);
        return { message: errorMessage };
    }
};


// queries all customer in DB
const grabAllCustomers = async () => {
  const url = customersAPI;

  try {
    const { data } = await axios({
      url,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
console.log("customers--- ", data.customers)
    return data.customers;
  } catch (error) {
    const errorMessage = error.message || error || "Problem getting customers";
    console.log(`###ERROR: ${errorMessage}`);
    return { message: errorMessage };
  }
};

// initial state
const initialState = {
    allIntegrationsAllCustomers: [],
    customers: [],
    integrations: [],
    loggedUser: "",
};

// create context & export
export const GlobalContext = createContext(initialState);

// building a provider
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [integrations, setIntegrations] = useState([]);
  const [customers, setCustomers] = useState(""); // it holds the array of customers, which will be used as users later
  const [loggedUser, setLoggedUser] = useState(0); // these two lines (^^) are going be used to mimic a logged user globally

  const [allIntegrationsAllCustomers, setAllIntegrationsAllCustomers] = useState("");
  const [allRunsFromAllCustomers, setAllRunsFromAllCustomers] = useState("");

    // this useEffect Hook grabs all the customers on load to be selected in the header
    useEffect(() => {
        const getAllCustomers = async () => {
            try {
                const customers = await grabAllCustomers();

                // after getting all customers,
                // the system gets all integrations for all customers
                const integrations = await grabAllIntegrations(customers);  ////////////////////////////
        // console.log("ALLintegrations ALL customers =============== ", integrations)
                setCustomers(customers);
                setAllIntegrationsAllCustomers(integrations);

            } catch(error) {
                console.log("###ERROR: ", error.message || error);
            }
        }
        getAllCustomers();

        return () => {
            setCustomers("");
            setAllIntegrationsAllCustomers("");
        }
    }, []);



    // maybe the best way to load allRunsAllCustomers is this (after allintegrations having something)
    useEffect(() => {
        const getAllRuns = async () => {
            try {
                console.log("there are integrations:: ", allIntegrationsAllCustomers);
                const tempAllIntegrations = allIntegrationsAllCustomers.map(e => e.id);
                console.log("there are integrations:: ", tempAllIntegrations);
                const allRuns = await grabAllRunsFromAllIntegrations(tempAllIntegrations);
        console.log("RUNNSSSSSSSSSSSSS ---------------- ", allRuns)
    
                setAllRunsFromAllCustomers(allRuns);
            } catch(error) {
                console.log("###ERROR: ", error.message || error);
            }
        }

        if (allIntegrationsAllCustomers)
            getAllRuns();

    }, [allIntegrationsAllCustomers]);



    // need to be all integrations for all cusomer, so disabling this code underneath and replacing for the one mentioned before
    // when getting customers, the system also grabs all integrations for all customers
  // this useEffect Hook sets all integrations once the user selected from the header
  useEffect(() => {
    const grabIntegrations = async () => {
      const res = await axios.get(`${integrationsAPI}/${loggedUser}`);

      let customerIntegrations = res.data;
      // grabs all the runs for each integration

      // for (let i = 0; i < customerIntegrations.length; i++) {
      //   const res = await axios.get(
      //     `${runsAPI}/${encodeURIComponent(customerIntegrations[i].id)}`,
      //     {
      //       params: {
      //         days: 100,
      //       },
      //     }
      //   );
      // customerIntegrations[i].runs = res.data;

      // }


      // this code get rides of the S object for every prop for each integration
      // (it breaks with the S object)


      console.log(customerIntegrations);
      setIntegrations(customerIntegrations);
    };
    grabIntegrations();
  }, [loggedUser]);

  const handleChangeUser = (event) => {
    setLoggedUser(event.target.value);
  };

  //values that are available from the provider
  return (
    <GlobalContext.Provider
      value={{
        allRunsFromAllCustomers,
        customers: customers,
        integrations: integrations,
        setIntegrations: setIntegrations,
        loggedUser: loggedUser,
        setLoggedUser: handleChangeUser,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};