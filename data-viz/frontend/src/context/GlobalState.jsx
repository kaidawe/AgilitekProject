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
  const [latestRuns, setLatestRuns] = useState([{}]);
  const [runStatusCount, setRunStatusCount] = useState({
    success: 0,
    failed: 0,
    missed: 0
  });
  
  useEffect(() => {
    const grabIntegrations = async (customer) => {
      const res = await axios.get(`https://orssblnqm3.execute-api.us-east-1.amazonaws.com/api/integrations/${customer}`);
      const integrations = res.data;

      for (let i = 0; i < integrations.length; i++) {
        const res = await axios.get(`https://orssblnqm3.execute-api.us-east-1.amazonaws.com/api/runs/${encodeURIComponent(integrations[i].id.S)}`);
        integrations[i].runs = res.data;
      }
      setIntegrations(integrations);
    }

    const getLatestRuns = () => {
      let runs = [];

      console.log(integrations);
      // grab all the latest runs from integrations
      for (let i = 0; i < integrations.length; i++) {
        // if there are no runs in the integration, continue to next iteration
        if(integrations[i].runs.length === 0) {
          continue;
        } 

        let latestDate = "0";
        let latestRun;
        integrations[i].runs.forEach((run) => {
          if(run.run_end > latestDate) {
            latestDate = run.run_end;
            latestRun = run;
          }
        })
        
        let count = runStatusCount;
        switch(latestRun.run_status) {
          case "success":
            count.success += 1;
            break;
          case "failed":
            count.failed += 1;
            break;
          case "missed":
            count.missed += 1;
            break;
          default: 
            break;
        }

        setRunStatusCount(count);
        runs.push(latestRun);
      }
      setLatestRuns(runs)
    }

    // grabIntegrations('CAVALIERS');
    // getLatestRuns();
  }, []);



  //values that are available from the provider
  return (
    <GlobalContext.Provider
      value={{
        integrations: integrations,
        setIntegrations: setIntegrations,
        latestRuns: latestRuns,
        setLatestRuns: setLatestRuns,
        runStatusCount: runStatusCount,
        setRunStatusCount: setRunStatusCount
      }}>
      {props.children}
    </GlobalContext.Provider>
  );
};