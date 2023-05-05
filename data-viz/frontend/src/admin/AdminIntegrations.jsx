import React, { useState, useEffect } from "react";

// import BarChart from './BarChart';

import { customersAPI, integrationsAPI, runsAPI } from "../globals/globals";
import axios from "axios";
import BarChart from "../SingleComponents/BarChart";
import { timeOptions } from "../globals/timeOptions";

export default function AdminIntegrations() {
  const [daysFilter, setDaysFilter] = useState(150); // default filter to all integrations
  const [selectedIntegration, setSelectedIntegration] = useState("0"); // default filter to all integrations
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [customers, setCustomers] = useState([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [integrations, setIntegrations] = useState([]);
  const [integrationsOption, setIntegrationsOption] = useState([]);
  const [loading, setLoading] = useState(false);
  // const customer = "CAVALIERS";

  const getCustomers = async () => {
    axios({
      url: customersAPI,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setCustomers(response.data.customers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getIntegrations = async () => {
    setLoading(true);
    let filteredIntegrations = [];
    const result = await axios.get(integrationsAPI + `/${selectedCustomer}`);
    filteredIntegrations = result.data;
    setIntegrationsOption(result.data);

    for (let i = 0; i < filteredIntegrations.length; i++) {
      const url =
        runsAPI + `/${encodeURIComponent(filteredIntegrations[i].id)}`;

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

    setIntegrations(filteredIntegrations);

    console.log(integrations);
    setLoading(false);
  };

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    getIntegrations();
  }, [selectedIntegration, statusFilter, daysFilter, selectedCustomer]);

  {
    /*handle filter by weeks onclick  */
  }

  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
    console.log(selectedCustomer);
  };

  const handleFilterWeek = (event) => {
    setDaysFilter(Number(event.target.value));
    console.log(daysFilter);
  };
  {
    /*handle filter by integration onclick  */
  }

  const handleIntegrationChange = (event) => {
    setSelectedIntegration(event.target.value);

    console.log("hadleInteg", selectedIntegration);
  };

  // generate integration ID options
  const integrationOptions = [
    { id: "0", name: "All integrations" },
    ...integrationsOption.map((integration) => ({
      id: integration.id,
      name: integration.integration_name,
    })),
  ];

  // generate customer ID options
  const customerOptions = [
    ...customers.map((customer) => ({
      id: customer,
      name: customer,
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
        {selectedCustomer && (
          <BarChart customer={selectedCustomer} daysFilter={150} />
        )}
        <div className="flex justify-center gap-10 py-4">
          {/*filter by customer  */}
          <div>
            <label for="customer-filter" className="font-bold">
              Filter by Customer:
            </label>
            <select
              id="integration-filter"
              value={selectedCustomer}
              onChange={handleCustomerChange}
              className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {customerOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

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
              Filter by time:
            </label>
            <select
              id="date-filter"
              value={daysFilter}
              onChange={handleFilterWeek}
              className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {timeOptions.map((option) => (
                <option key={option.label} value={option.days}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/*  filter by status  */}

        <div className="flex justify-center space-x-4 mb-4">
          <button
            className={`${
              statusFilter === ""
                ? "bg-blue-500"
                : "bg-gray-500 hover:bg-gray-600"
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
      {/* integration Infos */}

      {/* listing all the integration of rsl customer  */}
      {selectedCustomer && (
        <div
          style={{ height: "700px", overflowY: "scroll" }}
          className="overflow-auto relative"
        >
          {loading && (
            <div className="text-center">
              <i className="fas fa-spinner fa-pulse text-gray-500"></i>{" "}
              Loading...
            </div>
          )}
          {!loading && integrations.length === 0 && (
            <p>There are no runs available.</p>
          )}

          {!loading && integrations.length > 0 && (
            <table className="table-fixed border-x border-b w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left  text-xs font-medium text-gray-500 uppercase w-1/4">
                    Integration name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">
                    Run Start
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">
                    Run End
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">
                    Run Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">
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
                      <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                        {run.errorMsg}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!selectedCustomer && (
        <div className="text-center">Please select a customer</div>
      )}
    </div>
  );
}
