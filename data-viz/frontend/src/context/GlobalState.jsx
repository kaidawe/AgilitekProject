import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import {
  customersAPI,
  allIntegrationsAPI,
  allRunsFromAllIntegrationsAPI,
} from "../globals/globals.jsx";

// queries runs in DB
const grabRuns = async (integrations) => {
  const url = allRunsFromAllIntegrationsAPI;
  console.log(`INTEGRATIONS INPUT:: ${integrations.toString()}`);
  try {
    const { data } = await axios({
      url,
      params: {
        integrations: integrations.toString(),
        days: 7,
      },
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

// queries integrations in DB
const grabIntegrations = async (customers) => {
  const url = allIntegrationsAPI;

  try {
    const { data } = await axios({
      url,
      params: { customers: customers.toString() },
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    const errorMessage = error.message || error || "Problem getting customers";
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

    return data.customers;
  } catch (error) {
    const errorMessage = error.message || error || "Problem getting customers";
    console.log(`###ERROR: ${errorMessage}`);
    return { message: errorMessage };
  }
};

// initial state
const initialState = {
  // allIntegrationsAllCustomers: [],
  customers: [],
  integrations: [],
  runs: [],
  integrationsByCustomer: {},
  runsByIntegration: {},
  loggedUser: "",
};

// create context & export
export const GlobalContext = createContext(initialState);

// building a provider
export const GlobalProvider = (props) => {
  const [customers, setCustomers] = useState(); // it holds the array of customers, which will be used as users later
  const [loggedUser, setLoggedUser] = useState(""); // these two lines (^^) are going be used to mimic a logged user globally

  const [integrations, setIntegrations] = useState([]);
  const [runs, setRuns] = useState([]);

  // mainly used for admin stuff for easier sorting
  const [integrationsByCustomer, setIntegrationsByCustomer] = useState([]);
  const [runsByIntegration, setRunsByIntegration] = useState([]);

  // this hook grabs all customers to be displayed in the landing page log in
  useEffect(() => {
    const getAllCustomers = async () => {
      try {
        const customers = await grabAllCustomers();
        setCustomers(customers);
      } catch (error) {
        console.log("###ERROR: ", error.message || error);
      }
    };
    getAllCustomers();
  }, []);

  // upon user's selection, the system queries integrations for that one
  useEffect(() => {
    const getAllIntegrations = async () => {
      let tempCustomer = [];
      console.log(customers);
      console.log(loggedUser);
      if (loggedUser === "Administrator" && customers !== []) {
        tempCustomer = [...customers];
      } else {
        tempCustomer = [loggedUser];
      }

      const tempIntegrations = await grabIntegrations(tempCustomer);
      setIntegrations(tempIntegrations);

      if (loggedUser === "Administrator") {
        let tempInt = {};
        for (let index in tempIntegrations) {
          tempInt[tempIntegrations[index]["pk"]] === undefined
            ? (tempInt[tempIntegrations[index]["pk"]] = [
                tempIntegrations[index],
              ])
            : tempInt[tempIntegrations[index]["pk"]].push(
                tempIntegrations[index]
              );

          setIntegrationsByCustomer(tempInt);
        }
      }
    };

    if (loggedUser && loggedUser !== "Choose a user") getAllIntegrations();
  }, [loggedUser, customers]);

  // when the integrations change, the runs for the new set of integrations will be queried
  useEffect(() => {
    const getRuns = async () => {
      try {
        const tempIntegrations = integrations.map((e) => e.id);
        const tempAllRuns = await grabRuns(tempIntegrations);
        setRuns(tempAllRuns);

        if (loggedUser === "Administrator") {
          let tempRuns = {};
          for (let index in tempAllRuns) {
            tempRuns[tempAllRuns[index]["pk"]] === undefined
              ? (tempRuns[tempAllRuns[index]["pk"]] = [tempAllRuns[index]])
              : tempRuns[tempAllRuns[index]["pk"]].push(tempAllRuns[index]);

            setRunsByIntegration(tempRuns);
          }
        }
      } catch (error) {
        console.log("ERROR: ", error.message || error);
      }
    };

    if (integrations && integrations.length) getRuns();
  }, [integrations]);

  //values that are available from the provider
  return (
    <GlobalContext.Provider
      value={{
        customers: customers,
        integrations: integrations,
        setIntegrations: setIntegrations,

        runs: runs,
        setRuns: setRuns,

        integrationsByCustomer: integrationsByCustomer,
        setIntegrationsByCustomer: setIntegrationsByCustomer,

        runsByIntegration: runsByIntegration,
        setRunsByIntegration: setRunsByIntegration,

        loggedUser: loggedUser,
        setLoggedUser: setLoggedUser,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
