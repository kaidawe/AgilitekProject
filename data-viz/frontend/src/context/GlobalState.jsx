import React, { createContext, useReducer, useEffect, useState } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";
import { customersAPI, integrationsAPI, runsAPI } from '../globals/globals.jsx';


const grabIntegrations = async (customer) => {
  const res = await axios.get(`https://orssblnqm3.execute-api.us-east-1.amazonaws.com/api/integrations/${customer}`);
  const integrations = res.data;
  console.log(integrations);

  for (let i = 0; i < integrations.length; i++) {
    const res = await axios.get(`${runsAPI}/${encodeURIComponent(integrations[i].id)}`, {
      params: {
        days: 100,
      }
    });
    integrations[i].runs = res.data;
  }
  return integrations;
}


// queries all customer in DB
const grabAllCustomers = async () => {
    const url = customersAPI;

    try {
        const { data } =  await axios({
                url,
                method: 'get',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            
        return data.customers;
    } catch(error) {
        const errorMessage = error.message || error || "Problem getting customers";
        console.log(`###ERROR: ${errorMessage}`);
        return ({message: errorMessage});
    }
};

// initial state
const initialState = {
    integrations: [],
    customers: [],
    loggedUser: ""
};

// create context & export
export const GlobalContext = createContext(initialState);

// building a provider
export const GlobalProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    const [integrations, setIntegrations] = useState([]);
    const [customers, setCustomers] = useState(""); // it holds the array of customers, which will be used as users later, as well
    const [loggedUser, setLoggedUser] = useState(""); // these two lines (^^) are going be used to mimic a logged user globally

  
    useEffect(() => {
        const getCustomerIntegrations= async () => {
            const integrations = await grabIntegrations('CAVALIERS');
            setIntegrations(integrations);
        }
        // getCustomerIntegrations();
    
        
        const getAllCustomers = async () => {
            try {
                const customers = await grabAllCustomers();
                setCustomers(customers);
            } catch(error) {
                console.log("###ERROR: ", error.message || error);
            }
        }
        getAllCustomers();

        return () => {
            setCustomers("");
        }

    }, []);


    const handleChangeUser = event => {
        setLoggedUser(event.target.value);
    }


  //values that are available from the provider
    return (
    <GlobalContext.Provider
        value={{
            integrations: integrations,
            setIntegrations: setIntegrations,

            customers,
            loggedUser,
            setLoggedUser: handleChangeUser
        }}
    >
        {props.children}
    </GlobalContext.Provider>
  );
};