import React, { useState } from "react";

import rslData from "../../data/01G7FY02XJ145HE2TTJJRAE8BA.json";
import integrationsData from "../../data/json-file-1691.json";

export default function Integrations() {
  const [filter, setFilter] = useState(0); // default filter to all integrations
  const [selectedIntegration, setSelectedIntegration] = useState('0'); // default filter to all integrations
  const [statusFilter, setStatusFilter] = useState('');

  let filteredRuns = rslData;
  // console.log(filteredRuns);

  // apply integration ID filter
  if (selectedIntegration !== '0') {
    console.log(selectedIntegration);

    filteredRuns = rslData.filter((run) => run.pk === selectedIntegration);
  }

  // apply week filter
  if (filter !== 0) {
    filteredRuns = filteredRuns.filter((run) => {
      const runDate = new Date(run.run_start);
      const today = new Date();
      const filterDate = new Date();
      filterDate.setDate(today.getDate() - filter * 7); // filter by weeks

      return runDate >= filterDate && runDate <= today;
    });
  }
  // apply status  filter
  if (statusFilter !== '') {
    filteredRuns = filteredRuns.filter((run) => run.run_status === statusFilter);
  }

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
    { id: 0, name: "All integrations" },
    ...Array.from(new Set(rslData.map((run) => run.pk))).map((id) => {
      const integration = integrationsData.find((i) => i.id === id);
      return {
        id,
        name: integration ? integration.integration_name : `${id}`,
      };
    }),
  ];

            {/*handle filter by status onclick  */}


const handleStatusFilter = (status) => {
  setStatusFilter(status);
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
        <option value={0}>All runs</option>
        <option value={1}>One week</option>
        <option value={2}>Two weeks</option>
        <option value={3}>Three weeks</option>
      </select>
      </div>
    </div>
    {/*filter by status  */}

    <div className="flex justify-center space-x-4 mb-4">
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

    <table className="table-fixed border-x border-b w-full divide-y divide-gray-200">
  
  <thead>
    <tr>
      <th className="px-6 py-3 text-left  text-xs font-medium text-gray-500 uppercase w-1/2">Integration ID</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">ID</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/2 ">Log Details</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">Run Start</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3 ">Run End</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">Run Status</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5 ">Run Total Time</th>
    </tr>
  </thead>
      <tbody className="bg-white divide-y  divide-gray-200">
        {filteredRuns.map((run, index) => (
          <tr className="odd:bg-gray-100" key={index}>
            {/* {index === 0 && (
              <td rowSpan={filteredRuns.length} className="px-6 py-3 overflow-hidden text-sm font-medium text-gray-900">
                {run.pk}
              </td>
            )} */}
    <td className="px-6 py-3 overflow-hidden text-sm font-medium text-gray-900">{run.pk}   </td>
            <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">{run.id}</td>
            <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">{run.log_details}</td>
            <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">{new Date(run.start).toLocaleString()}</td>
            <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">{new Date(run.run_end).toLocaleString()}</td>
            <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                 {run.run_status === 'success' && <i className="fas fa-check text-green-500"></i>}
  {run.run_status === 'in_progress' && <i className="fas fa-spinner fa-pulse text-yellow-500"></i>}
  {run.run_status === 'failed' && <i className="fas fa-times text-red-500"></i>}
  </td>
            <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">{run.runTotalTime}</td>
  
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
