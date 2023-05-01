import React, { createContext, useReducer, useEffect, useState } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";

const grabIntegrations = async (customer) => {
  const res = await axios.get(`https://orssblnqm3.execute-api.us-east-1.amazonaws.com/api/integrations/${customer}`);
  const integrations = res.data;

  for (let i = 0; i < integrations.length; i++) {
    const res = await axios.get(`https://orssblnqm3.execute-api.us-east-1.amazonaws.com/api/runs/${encodeURIComponent(integrations[i].id.S)}`);
    integrations[i].runs = res.data;
  }
  return integrations;
}


// initial state
const initialState = {
 integrations: []
};

// create context & export
export const GlobalContext = createContext(initialState);

// building a provider
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [integrations, setIntegrations] = useState([]);

  
  useEffect(() => {
    const getCustomerIntegrations= async () => {
      const integrations = await grabIntegrations('CAVALIERS');
      setIntegrations(integrations);

    }

    getCustomerIntegrations();
    
  }, []);



  //values that are available from the provider
  return (
    <GlobalContext.Provider
      value={{
        integrations: integrations,
        setIntegrations: setIntegrations,
      }}>
      {props.children}
    </GlobalContext.Provider>
  );
};