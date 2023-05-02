import React, { useState, useEffect } from "react";

// import BarChart from './BarChart';

import { customersAPI, integrationsAPI, runsAPI } from "../globals/globals";
import axios from "axios";
import BarChart from "./BarChart";
import IntegrationDetails from "./IntegrationDetails";

import { timeOptions } from '../globals/timeOptions.jsx';

export default function Integrations() {
  const [daysFilter, setDaysFilter] = useState(90); // default filter to all integrations
  const [selectedIntegration, setSelectedIntegration] = useState("0"); // default filter to all integrations
  const [statusFilter, setStatusFilter] = useState("");
  const [integrations, setIntegrations] = useState([]);
  const [integration, setIntegration] = useState();

  const [integrationsOption, setIntegrationsOption] = useState([]);
  const [loading, setLoading] = useState(false);
  const customer = "CAVALIERS";

  const getIntegrations = async () => {
    setLoading(true);
    let filteredIntegrations = [];
    const result = await axios.get(integrationsAPI + `/${customer}`);
    filteredIntegrations = result.data;
    setIntegrationsOption(result.data);
   
  
    for (let i = 0; i < filteredIntegrations.length; i++) {
      const url = runsAPI + `/${encodeURIComponent(filteredIntegrations[i].id)}`;

      const response = await axios.get(url, {
        params: {
          days: daysFilter,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      filteredIntegrations[i].runs = response.data;
    }
    if (selectedIntegration !== "0") {
      filteredIntegrations = filteredIntegrations.filter(
        (integration) => integration.id === selectedIntegration
      );
  
    }

    if (statusFilter !== "") {
      filteredIntegrations.forEach((integration) => {
        integration.runs = integration.runs.filter(
          (run) => run.run_status === statusFilter
        );
      });
      
    }
    if(filteredIntegrations.length===1){
    setIntegration(filteredIntegrations[0]);}
    else{
      setIntegration(null)
    }

    setIntegrations(filteredIntegrations);

// console.log(integrations)
    setLoading(false);
  };
  useEffect(() => {

    getIntegrations();
  }, [selectedIntegration, statusFilter, daysFilter]);

  {
    /*handle filter by weeks onclick  */
  }

  const handleFilterWeek = (event) => {
    setDaysFilter(Number(event.target.value));
    console.log(daysFilter);
  };
  {
    /*handle filter by integration onclick  */
  }

  const handleIntegrationChange = (event) => {

    setSelectedIntegration(event.target.value);
    // setIntegration(integrations.filter(integration => integration.id === selectedIntegration)[0]);

    
        console.log("handleSelectInteg", selectedIntegration);
    console.log("handleInteg****", integration);

  };

  // generate integration ID options
  const integrationOptions = [
    { id: "0", name: "All runs" },
    ...integrationsOption.map((integration) => ({
      id: integration.id,
      name: integration.integration_name,
    })),
  ];

  {
    /*handle filter by status onclick  */
  }

  const handleStatusFilter = (status) => {
    console.log("hadleStatus", status);
    setStatusFilter(status);
    console.log("hadleStatus", statusFilter);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="box">
      {/* {!loading && integrations.length > 0 && ( 
         <BarChart data={integrationChart} />
      )} */}
      <BarChart customer={customer} daysFilter={150} />   


          <div className="flex items-center ">
        <div>
        <div className="flex justify-center  gap-10 py-4">
          {/*filter by integration  */}

          <div>
            <label for="integration-filter" className="font-bold">
              Filter by integration:
            </label>
            <select
              id="integration-filter"
              value={selectedIntegration}
              onChange={handleIntegrationChange}
              className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {integrationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          {/*filter by weeks  */}

          <div>
            <label for="date-filter" className="font-bold">
              Filter by weeks:
            </label>
            <select
              id="date-filter"
              value={daysFilter}
              onChange={handleFilterWeek}
              className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={7}>1 week</option>
              <option value={21}>3 weeks</option>
              <option value={63}>6 weeks</option>
              <option value={90}>3 months</option>
              <option value={150}>5 months</option>

            </select>
          </div>
        </div>
        {/*  filter by status  */}

        <div className="flex justify-center space-x-4 mb-4">
  <button
    className={`${
      statusFilter === "" ? "bg-blue-500" : "bg-gray-500 hover:bg-gray-600"
    } text-white py-2 px-4 rounded`}
    onClick={() => handleStatusFilter("")}
  >
    All Runs
  </button>
  <button
    className={`${
      statusFilter === "success"
        ? "bg-blue-500"
        : "bg-green-500 hover:bg-green-600"
    } text-white py-2 px-4 rounded`}
    onClick={() => handleStatusFilter("success")}
  >
    Success
  </button>
  <button
    className={`${
      statusFilter === "in_progress"
        ? "bg-blue-500"
        : "bg-yellow-500 hover:bg-yellow-600"
    } text-white py-2 px-4 rounded`}
    onClick={() => handleStatusFilter("in_progress")}
  >
    In Progress
  </button>
  <button
    className={`${
      statusFilter === "failed"
        ? "bg-blue-500"
        : "bg-red-500 hover:bg-red-600"
    } text-white py-2 px-4 rounded`}
    onClick={() => handleStatusFilter("failed")}
  >
    Failed
  </button>
</div>

</div>
{/* {!loading && integrations.length === 1 && (
  integrations.map((integration) => (
    <div className="bg-gray-200 rounded-lg p-4 m-4">
      <h2 className="text-2xl text-sky-500 mb-2 underline text-gray-800">
      <span className="text-sky-500">&rarr;</span>
 Integration Details</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className=" bg-white p-2 rounded-lg">
          <strong className="text-gray-800">Integration Name: </strong> {integration.integration_name}
        </div>
        <div className="bg-white p-2 rounded-lg">

          <strong className="text-gray-800">Data Source: </strong> {integration.data_source}
        </div>
        <div className="bg-white p-2 rounded-lg">
          <strong className="text-gray-800">Data Destination: </strong> {integration.data_destination}
        </div>
        <div className=" bg-white p-2 rounded-lg">
          <strong className="text-gray-800">Run Trigger: </strong> {integration.trigger}
        </div>
      </div>
    </div>
  ))
)} */}
      <IntegrationDetails integration={integration}  /> 


</div>

      </div>
{/* integration Infos */}





      {/* listing all the integration of rsl customer  */}
      <div
        style={{ height: "700px", overflowY: "scroll" }}
        className="overflow-auto relative"
      >
        {loading && (
          <div className="text-center">
            <i className="fas fa-spinner fa-pulse text-gray-500"></i> Loading...
          </div>
        )}
        {!loading && (integrations.length == 0 || integrations.every(integration => integration.runs.length === 0)) &&(
          <p className="text-center text-gray-500"> NO runs available.</p>

        )
      }
        
        {!loading && integrations.length > 0  && (
          
          <table className="table-fixed text-center border-x border-b divide-y divide-gray-200">
            <thead>
              <tr>
              <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
                  Integration name
                </th>

                <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
                  ID
                </th>
                <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
                  Run Start
                </th>
                <th className="px-6 py-3  text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
                  Run End
                </th>
                <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
                  Run Status
                </th>
                <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
                  Duration
                </th>
                <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y  divide-gray-200">
              {integrations.map((integration) =>
                integration.runs.map((run, index) => (
                  <tr
                    className="odd:bg-gray-100"
                    key={`${integration.id}-${index}`}
                  >
                    <td className="px-6 py-3 overflow-hidden text-sm font-medium text-gray-900">
                      {integration.integration_name}
                    </td>
                    <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                      {run.id}
                    </td>
                    <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                      {new Date(run.run_start).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                      {" "}
                      {run.run_end
                        ? new Date(run.run_end).toLocaleString()
                        : ""}
                    </td>
                   
                    <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                      {run.run_status === "success" && (
                        <i className="fas fa-check text-green-500"></i>
                      )}
                      {run.run_status === "in_progress" && (
                        <i className="fas fa-spinner fa-pulse text-yellow-500"></i>
                      )}
                      {run.run_status === "failed" && (
                        <i className="fas fa-times text-red-500"></i>
                      )}
                    </td>
                    <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                      {run.runTotalTime} min
                    </td>
                    <td className={`px-6 py-3 overflow-hidden text-sm ${run.errorMsg ? 'bg-red-200' : 'text-gray-500'}`}>
  {run.errorMsg ? run.errorMsg : ''}
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      
      </div>
    </div>
  );
}
