import React, { createContext, useReducer, useEffect, useState } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";

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
    const grabIntegrations = async (customer) => {
      const res = await axios.get(`https://orssblnqm3.execute-api.us-east-1.amazonaws.com/api/integrations/${customer}`);
      const integrations = res.data;

      for (let i = 0; i < integrations.length; i++) {
        const res = await axios.get(`https://orssblnqm3.execute-api.us-east-1.amazonaws.com/api/runs/${encodeURIComponent(integrations[i].id.S)}`);
        integrations[i].runs = res.data;
      }
      console.log(integrations);
      setIntegrations(integrations);
    }

    grabIntegrations('RSL');
  }, []);



  //values that are available from the provider
  return (
    <GlobalContext.Provider
      value={{
        integrations: integrations,
        setIntegrations: setIntegrations
      }}>
      {props.children}
    </GlobalContext.Provider>
  );
};