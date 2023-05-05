import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { customersAPI, allIntegrationsAPI, allRunsFromAllIntegrationsAPI } from "../globals/globals.jsx";


// queries runs in DB
const grabRuns = async integrations => {
    const url = allRunsFromAllIntegrationsAPI;
    
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
        
        return data;
    } catch (error) {
        const errorMessage = error.message || error || "Problem getting customers";
        console.log(`###ERROR: ${errorMessage}`);
        return { message: errorMessage };
    }
};


// queries integrations in DB
const grabIntegrations = async customers => {
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
    const [customers, setCustomers] = useState(""); // it holds the array of customers, which will be used as users later
    const [loggedUser, setLoggedUser] = useState(""); // these two lines (^^) are going be used to mimic a logged user globally
    const [integrations, setIntegrations] = useState("");
    const [runs, setRuns] = useState("");

    // this useEffect Hook grabs all the customers on load to be selected in the header
    useEffect(() => {
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



    // upon user's selection, the system queries integrations for that one
    useEffect(() => {
        const getAllIntegrations = async () => {
            let tempCustomer = [];
            if (loggedUser === "Administrator") {
                tempCustomer = [...customers];
            } else {
                tempCustomer = [loggedUser];
            }

            const integrations = await grabIntegrations(tempCustomer);
            setIntegrations(integrations);
        }
        
        if (loggedUser && loggedUser !== "Choose a user")
            getAllIntegrations();


        return () => {
            setIntegrations("");
        }

    }, [loggedUser]);



    // when the integrations change, the runs for the new set of integrations will be queried
    useEffect(() => {
        const getRuns = async () => {
            try {
                const tempIntegrations = integrations.map(e => e.id);
                const allRuns = await grabRuns(tempIntegrations);    
                setRuns(allRuns);
            } catch(error) {
                console.log("###ERROR: ", error.message || error);
            }
        }

        if (integrations && integrations.length)
            getRuns();

        return () => {
            setRuns("");
        }

    }, [integrations]);



    // changing user/customer function
    const handleChangeUser = (event) => {
        console.log("changing user to::: ", event.target.value)
        setLoggedUser(event.target.value);
    };



    //values that are available from the provider
    return (
        <GlobalContext.Provider
            value={{
                customers,
                integrations,
                runs,
                loggedUser,
                setLoggedUser: handleChangeUser,
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};