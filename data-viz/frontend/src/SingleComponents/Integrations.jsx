import React, { useState ,useEffect} from "react";

import rslData from "../../data/01G7FY02XJ145HE2TTJJRAE8BA.json";
import integrationsData from "../../data/json-file-1691.json";
import { customersAPI, integrationsAPI ,runsAPI,runsCustomerAPI} from '../globals/globals'
import axios from 'axios'

export default function Integrations() {
  const [filter, setFilter] = useState(0); // default filter to all integrations
  const [selectedIntegration, setSelectedIntegration] = useState('0'); // default filter to all integrations
 const [integrationIds,setIntegrationIds]=useState([])
  const [statusFilter, setStatusFilter] = useState('');
  const [integrations, setIntegrations] = useState([]);
  const [runs,setRuns]=useState([])

const customer = 'CAVALIERS';
  const getIntegrations = async () => {
    axios({
      url: integrationsAPI + `/${customer}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setIntegrations(response.data)
        setIntegrationIds(response.data.map(integration => integration.id.S));

        console.log("integrationIds---",integrationIds)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const getAllRuns = async (integrationIds) => {
    let allRuns = [];

    for (const id of integrationIds) {
      try {
        const url = runsAPI + `/${encodeURIComponent(id)}`;
        const response = await axios.get(url);
        const runs = response.data;
        allRuns = [...allRuns, ...runs];
      } catch (error) {
        console.error(`Failed to fetch runs for integration ${id}:`, error);
      }
    }
    return allRuns;

  }
  useEffect(() => {
    getIntegrations()
    console.log(integrations)
  }, [])
    const getRuns = async (filterWeeks) => {
      let url = '';
      let runs = [];
    
      if (selectedIntegration === '0') {
        const allRuns = await getAllRuns(integrationIds);
        runs = allRuns;
      } else {
        url = runsAPI + `/${encodeURIComponent(selectedIntegration)}`;
        const response = await axios.get(url);
        runs = response.data;
      }
    
      if (filterWeeks > 0) {
        // filter runs by week
        const today = new Date();
        const filterDate = new Date();
        filterDate.setDate(today.getDate() - filterWeeks * 7);
    
        runs = runs.filter((run) => {
          const runDate = new Date(run.run_start.S);
          return runDate >= filterDate && runDate <= today;
        });
      }
    
      if (statusFilter !== '') {
        runs = runs.filter((run) => run.run_status.S === statusFilter);
      }
    
      setRuns(runs);
    }
    
  
  useEffect(() => {
    getRuns(filter)
    console.log(runs)
  }, [selectedIntegration,filter,statusFilter])
 

 
 

            {/*handle filter by week onclick  */}

  const handleFilterWeek = (event) => {
    setFilter(Number(event.target.value));
    
  };
            {/*handle filter by integration onclick  */}

  const handleIntegrationChange = (event) => {
    setSelectedIntegration(event.target.value);
  };

  // generate integration ID options
  const integrationOptions = [
    { id: 0, name: "All runs" },
    ...integrations.map(integration => ({ id: integration.id.S, name: integration.integration_name.S }))

  ];

            {/*handle filter by status onclick  */}


const handleStatusFilter = (status) => {
  console.log("hadleStatus",status);
  setStatusFilter(status);
  console.log("hadleStatus",statusFilter);

};

  return (
    <div className="flex flex-col gap-2">
            <div className="box">

    <div className="flex justify-center gap-10 py-4">
            {/*filter by integration  */}

        <div>
      <label for="integration-filter" className="font-bold">Filter by integration:</label>
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
      <label for="date-filter" className="font-bold">Filter by weeks:</label>
      <select
        id="date-filter"
        value={filter}
        onChange={handleFilterWeek}
        className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value={1}>One week</option>
        <option value={2}>Two weeks</option>
        <option value={12}>Three weeks</option>
      </select>
      </div>
    </div>
    {/*  filter by status  */}

    <div className="flex justify-center space-x-4 mb-4">
    <button
    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
    onClick={() => handleStatusFilter("")}
  >
    All Runs
  </button>
  <button
    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
    onClick={() => handleStatusFilter("success")}
  >
    Success
  </button>
  <button
    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
    onClick={() => handleStatusFilter("in_progress")}
  >
    In Progress
  </button>
  <button
    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
    onClick={() => handleStatusFilter("failed")}
  >
    Failed
  </button>
</div>
</div>
{/* listing all the integration of rsl customer  */}
    <div style={{ height: '700px', overflowY: 'scroll' }} className="overflow-auto relative">
    {runs.length === 0 && (
  <p>There are no runs based on the selected filter.</p>
)}

{runs.length > 0 && (
    <table className="table-fixed border-x border-b w-full divide-y divide-gray-200">
  
  <thead>
    <tr>
      <th className="px-6 py-3 text-left  text-xs font-medium text-gray-500 uppercase w-1/2">Integration ID</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">ID</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/2 ">Log Details</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">Run Start</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3 ">Run End</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">Run Status</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">Message</th>
    </tr>
  </thead>
      <tbody className="bg-white divide-y  divide-gray-200">
        {runs.map((run, index) => (
          <tr className="odd:bg-gray-100" key={index}>
            {/* {index === 0 && (
              <td rowSpan={filteredRuns.length} className="px-6 py-3 overflow-hidden text-sm font-medium text-gray-900">
                {run.pk}
              </td>
            )} */}
    <td className="px-6 py-3 overflow-hidden text-sm font-medium text-gray-900">{run.pk.S}  </td>
            <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">{run.id.S}</td>
            <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">{run.log_details.S}</td>
            <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">{new Date(run.run_start.S).toLocaleString()}</td>
            <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">  {run.run_end ? new Date(run.run_end.S).toLocaleString() : ''}
</td>
            <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                 {run.run_status.S === 'success' && <i className="fas fa-check text-green-500"></i>}
  {run.run_status.S === 'in_progress' && <i className="fas fa-spinner fa-pulse text-yellow-500"></i>}
  {run.run_status.S === 'failed' && <i className="fas fa-times text-red-500"></i>}
  </td>
            <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
            <ul>
    {run.run_status.S == 'failed' && run.step_history.L.map((step, index) => (
      step.M.step_status.S === "failed" && (
        <li key={index}>
          {/* <p>ID: {step.M.id.S}</p> */}
          <p> {step.M.completed_step.S}</p>
          {/* <p>Step Ended: {new Date(step.M.step_ended.S).toLocaleString()}</p>
          <p>Step Status: {step.M.step_status.S}</p> */}
          {/* <p>Warning Message: {step.M.warning_message.S}</p> */}
        </li>
      )
    ))}
  </ul> 

    </td> 
  
            </tr>
          ))}
        </tbody>
      </table>)}
      </div>
    </div>
  );
};
