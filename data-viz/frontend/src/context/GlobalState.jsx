import React, { createContext, useReducer, useEffect, useState } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";
import { customersAPI, integrationsAPI, runsAPI } from "../globals/globals.jsx";

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
  integrations: [],
  customers: [],
  loggedUser: 0,
};

// create context & export
export const GlobalContext = createContext(initialState);

// building a provider
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [integrations, setIntegrations] = useState([]);
  const [customers, setCustomers] = useState(""); // it holds the array of customers, which will be used as users later
  const [loggedUser, setLoggedUser] = useState(0); // these two lines (^^) are going be used to mimic a logged user globally

  // this useEffect Hook grabs all the customers on load to be selected in the header
  useEffect(() => {
    const getAllCustomers = async () => {
      const customers = await grabAllCustomers();

      const initialOptions = [
        { id: 0, name: "Choose a user" },
        { id: 1, name: "Administrator" },
      ];

      if (customers.length > 0) {
        const allCustomers = customers.map((customer, index) => ({
          id: index + initialOptions.length,
          name: customer,
        }));
        setCustomers([...initialOptions, ...allCustomers]);
      } else setCustomers(customers);
    };

    getAllCustomers();
  }, []);

  // this useEffect Hook sets all integrations once the user selected from the header
  useEffect(() => {
    const grabIntegrations = async () => {
      const res = await axios.get(`${integrationsAPI}/${loggedUser}`);
      console.log(integrationsAPI);
      console.log(res);
      const integrations = res.data;

      // for (let i = 0; i < integrations.length; i++) {
      //   const res = await axios.get(
      //     `${runsAPI}/${encodeURIComponent(integrations[i].id)}`,
      //     {
      //       params: {
      //         days: 100,
      //       },
      //     }
      //   );
      //   integrations[i].runs = res.data;
      // }
      // return integrations;
    };
    // const getCustomerIntegrations = async () => {
    //   const integrations = await grabIntegrations(loggedUser.name);
    // };
    // console.log(loggedUser);
    // getCustomerIntegrations();
    grabIntegrations();
  }, [loggedUser]);

  const handleChangeUser = (event) => {
    setLoggedUser(event.target.value);
  };

  //values that are available from the provider
  return (
    <GlobalContext.Provider
      value={{
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
