import React, { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import IntegrationTimeline from '../components/IntegrationTimeline'
import Loading from '../components/Loading'

const IntegrationDetails = () => {
  const { integrationId } = useParams()

  const [daysFilter, setDaysFilter] = useState(1) // default filter to all integrations
  const [statusFilter, setStatusFilter] = useState('')
  const prop = useContext(GlobalContext)
  const [integration, setIntegration] = useState()
  const [integrationRuns, setIntegrationRuns] = useState([])
  const [filterMsg, setFilterMsg] = useState('')

  function filterData() {
    setFilterMsg('')

    let runsFiltered = []
    let filtered = []
    if (prop.integrations.length > 0) {
      console.log('integrations', prop.integrations)

      const integrationFiltered = prop.integrations.find(
        (int) => int.id === integrationId
      )
      console.log('integration2', integrationFiltered)
      setIntegration(integrationFiltered)
    }
    if (prop.runs.length > 0) {
      console.log('runs', prop.runs)

      runsFiltered = prop.runs.filter((run) => run.pk === integrationId)

      console.log('IntegrationRuns****', runsFiltered)
      setIntegrationRuns(runsFiltered)
      console.log('IntegrationRuns------', integrationRuns)
    }

    if (statusFilter) {
      console.log('sssssss', statusFilter)
      filtered = runsFiltered.filter((run) => run.run_status === statusFilter)
      console.log('StatusIntegrationRuns****', filtered)

      if (filtered.length > 0) {
        setIntegrationRuns(filtered)
        console.log('IntegrationRuns------', integrationRuns)
      } else {
        setFilterMsg('No data with the filter selected')
      }
    }
  }

  useEffect(() => {
    filterData()
  }, [prop, integrationId, statusFilter, daysFilter])

  const totalRuns = integrationRuns.length
  const totalRunTime = integrationRuns.reduce((total, run) => {
    return total + parseFloat(run.runTotalTime)
  }, 0)

  const averageRunTime = (totalRunTime / totalRuns).toFixed(2)

  let failedCount = 0
  let successCount = 0
  let in_progress = 0

  for (let i = 0; i < integrationRuns.length; i++) {
    // if there are no runs in the integration, continue to next iteration
    if (integrationRuns[i].run_status === 'success') {
      successCount += 1
    } else if (integrationRuns[i].run_status === 'failed') {
      failedCount += 1
    } else if (integrationRuns[i].run_status === 'in progress') {
      in_progress += 1
    }
  }

  function getStatusTextColor(status) {
    if (status === 'failed') {
      return 'text-failed-red'
    } else if (status === 'in progress') {
      return 'text-progress-yellow'
    } else {
      return 'text-main-blue'
    }
  }

  const handleStatusFilter = (status) => {
    console.log('hadleStatus', status)
    setStatusFilter(status)
    console.log('hadleStatus', statusFilter)
  }

  return (
    <div>
      <Link to="/home">
        <button className="text-white bg-main-blue hover:bg-main-blue-hover py-2 px-4 rounded border border-slate m-1">
          Back To Full Timeline
        </button>
      </Link>
      {prop.loggedUser && !prop.runs && (
        <div className="bg-white shadow rounded-lg p-4">
          <Loading />
        </div>
      )}
      {prop.runs && (
        <>
          {integration && integrationRuns && (
            <>
              <IntegrationTimeline integrationId={integration.id} />
              <div className="flex flex-row flex-wrap justify-center gap-2 mt-2">
                <div className="flex flex-row gap-2 items-center  bg-white p-2 rounded-xl shadow-xl w-1/4">
                  <i className="fa-solid fa-database"></i>
                  <div className="text-left">
                    <strong className="flex text-gray-800">Source</strong>
                    {integration.data_source}
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-xl w-1/4">
                  <i className="fa-solid fa-database"></i>
                  <div>
                    <strong className="flex items-center text-gray-800">
                      Destination
                    </strong>
                    {integration.data_destination}
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-xl w-1/4">
                  <i className="fa-solid fa-gauge"></i>
                  <div className="text-left">
                    <strong className="flex text-gray-800">
                      Average Run Time
                    </strong>
                    {averageRunTime}
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-xl w-1/4">
                  <i className="fa-solid fa-play"></i>
                  <div className="text-left">
                    <strong className="flex text-gray-800">
                      Number of Runs
                    </strong>
                    {totalRuns}
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-xl pr-4">
                  <i className="fa-solid fa-clock"></i>
                  <div>
                    <strong className="flex items-center text-gray-800">
                      Run Trigger
                    </strong>
                    {integration.trigger}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl mt-2 p-4">
                <div className="flex justify-center space-x-4 pt-6 mb-2">
                  <button
                    className={`${
                      statusFilter === ''
                        ? 'bg-main-blue text-white hover:bg-main-blue-hover'
                        : ''
                    } py-2 px-4 rounded border-2 border-main-blue hover:bg-light-main-blue`}
                    onClick={() => handleStatusFilter('')}
                  >
                    All Runs
                  </button>
                  <button
                    className={`${
                      statusFilter === 'success'
                        ? 'bg-success-green text-white'
                        : 'bg-white'
                    }py-2 px-4 rounded border-2 border-success-green hover:bg-light-success-green`}
                    onClick={() => handleStatusFilter('success')}
                  >
                    Success
                  </button>
                  <button
                    className={`${
                      statusFilter === 'in progress'
                        ? 'bg-progress-yellow'
                        : 'bg-white'
                    } py-2 px-4 rounded border-2 border-progress-yellow hover:bg-light-progress-yellow`}
                    onClick={() => handleStatusFilter('in progress')}
                  >
                    In Progress
                  </button>
                  <button
                    className={`${
                      statusFilter === 'failed'
                        ? 'bg-failed-red text-white'
                        : 'bg-white'
                    }py-2 px-4 rounded border-2 border-failed-red hover:bg-light-failed-red`}
                    onClick={() => handleStatusFilter('failed')}
                  >
                    Failed
                  </button>
                </div>
                {filterMsg && (
                  <h2 className="text-center text-xxl text-red-700 p-2">
                    {filterMsg} "{statusFilter}"{' '}
                  </h2>
                )}
                <div
                  style={{ height: '700px', overflowY: 'scroll' }}
                  className="flex overflow-auto relative justify-center "
                >
                  <table className="table-fixed text-center border-2 border-b divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-center text-sm font-medium bg-main-blue text-white uppercase w-auto border-r-2 border-r-white">
                          ID
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium bg-main-blue text-white uppercase w-auto border-r-2 border-r-white">
                          Run Start
                        </th>
                        <th className="px-6 py-3  text-center text-sm font-medium bg-main-blue text-white uppercase w-auto border-r-2 border-r-white">
                          Run End
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium bg-main-blue text-white uppercase w-auto border-r-2 border-r-white">
                          Run Status
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium bg-main-blue text-white uppercase w-auto border-r-2 border-r-white">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y  divide-gray-200">
                      {integrationRuns.map((run) => (
                        <tr className="odd:bg-light-main-blue">
                          <td
                            className={`px-6 py-3 overflow-hidden text-sm underline ${getStatusTextColor(
                              run.run_status
                            )}`}
                          >
                            <Link
                              to={`/rundetails/${encodeURIComponent(run.id)}`}
                            >
                              {run.id}
                            </Link>
                          </td>

                          <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                            {new Date(run.run_start).toLocaleString()}
                          </td>
                          <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                            {' '}
                            {run.run_end
                              ? new Date(run.run_end).toLocaleString()
                              : ''}
                          </td>

                          <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                            {run.run_status === 'success' && (
                              <i className="fas fa-check text-success-green"></i>
                            )}
                            {run.run_status === 'in progress' && (
                              <i className="fas fa-spinner fa-pulse text-progress-yellow"></i>
                            )}
                            {run.run_status === 'failed' && (
                              <i className="fas fa-times text-failed-red"></i>
                            )}
                          </td>
                          <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                            {run.runTotalTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default IntegrationDetails
