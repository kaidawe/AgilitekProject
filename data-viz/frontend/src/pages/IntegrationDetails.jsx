import React, { useState, useContext, useEffect } from 'react'
import { Chart } from 'react-google-charts'
import BarChart2 from '../SingleComponents/BarChart2'
import ScatterChart from '../SingleComponents/BarChart2'
import { GlobalContext } from '../context/GlobalState'
import { FaDatabase, FaClock, FaRunning, FaPlay } from 'react-icons/fa'
import { differenceInDays, isAfter, startOfDay } from 'date-fns'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import IntegrationTimeline from '../SingleComponents/IntegrationTimeline'
import Loading from '../SingleComponents/Loading'

const IntegrationDetails = () => {
  const { integrationId } = useParams()
  console.log('integraaaaaaaaaaaa', integrationId)

  const [daysFilter, setDaysFilter] = useState(1) // default filter to all integrations
  const [statusFilter, setStatusFilter] = useState('')
  const prop = useContext(GlobalContext)
  const [integration, setIntegration] = useState()
  const [integrationRuns, setIntegrationRuns] = useState([])
  const [filterMsg, setFilterMsg] = useState('')
  console.log('byintegration', prop.runsByIntegration)
  console.log(integrationId)
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

    // filter by days
    if (daysFilter) {
      console.log('dddddddd=====', daysFilter)

      const today = new Date(2022, 10, 15, 0, 0, 0, 0)
      filtered = runsFiltered.filter((run) => {
        const runDate = new Date(run.run_start)
        console.log('today______', today)

        console.log('runDate______', runDate)

        const daysAgo = differenceInDays(today, runDate)
        console.log('daysAgo=====', daysAgo)
        if (daysAgo > daysFilter) {
          return false
        }
        return true
      })
      if (filtered.length > 0) {
        console.log('IntegrationRunsDayfilteeer------', filtered)

        setIntegrationRuns(filtered)
        console.log('IntegrationRunsDayfilteeer------', integrationRuns)
      } else {
        console.log('noooooo------')

        setFilterMsg('No data with the filter selected')
      }
      if (statusFilter) {
        console.log('sssssss', statusFilter)
        filtered = filtered.filter((run) => run.run_status === statusFilter)
        console.log('StatusIntegrationRuns****', filtered)

        if (filtered.length > 0) {
          setIntegrationRuns(filtered)
          console.log('IntegrationRuns------', integrationRuns)
        } else {
          setFilterMsg('No data with the filter selected')
        }
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

  console.log('totallll', totalRunTime)
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
  console.log('failed', failedCount)
  console.log('success', successCount)
  console.log('inProgress', in_progress)

  const data = [
    ['data', 'count'],
    ['Successful', successCount],
    ['Failed', failedCount],
    ['InProgress', in_progress],
  ]

  const options = {
    // title: 'Runs STATUS',
    // sliceVisibilityThreshold: 0.2, // 20%
    pieSliceText: 'value',
    legend: {
      position: 'left',
      // alignment: "center",
      maxLines: 0,
      width: '200px',
      textStyle: {
        fontSize: 12,
      },
      scrollArrows: false,
      pagination: false,
    },
    tooltip: {
      showColorCode: false,
      isHtml: true,
    },
    // pieStartAngle: 180, // Center the pie chart.
    pieSliceTextStyle: {
      fontSize: 20,
      bold: true,
    },
    colors: ['#4BC940', '#F0BC39', '#FF0000'],
    // backgroundColor: "rgb(215, 215, 215)", // set background color
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
  const handleFilterWeek = (filter) => {
    setDaysFilter(Number(filter))
    console.log(daysFilter)
  }
  return (
    <div>
      <Link to="/timeline">
        <button className="back-button">Back To Full Timeline</button>
      </Link>
      {!prop.loggedUser && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-center">Please select a user above.</div>
        </div>
      )}
      {prop.loggedUser && !prop.runs && (
        <div className="bg-white shadow rounded-lg p-4">
          <Loading />
        </div>
      )}
      {prop.runs && (
        <>
          {integration && integrationRuns && (
            <>
              <IntegrationTimeline />
              <div className="flex flex-row flex-wrap justify-center gap-2 mt-2">
                <div className="flex flex-row gap-2 items-center  bg-white p-2 rounded-xl shadow-xl w-1/4">
                  <i class="fa-solid fa-database"></i>
                  <div>
                    <strong className="flex items-center text-gray-800">
                      Source
                    </strong>
                    {integration.data_source}
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-xl w-1/4">
                  <i class="fa-solid fa-database"></i>
                  <div>
                    <strong className="flex items-center text-gray-800">
                      Destination
                    </strong>
                    {integration.data_destination}
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-xl w-1/4">
                  <i class="fa-solid fa-gauge"></i>
                  <div className="flex flex-col items-center">
                    <strong className="text-gray-800">Average Run Time</strong>
                    {averageRunTime} mins
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-xl w-1/4">
                  <i class="fa-solid fa-play"></i>
                  <div className="flex flex-col items-center justify-items-center">
                    <strong className="text-gray-800">Number of Runs</strong>
                    {totalRuns}
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-xl w-1/2">
                  <i class="fa-solid fa-clock"></i>
                  <div>
                    <strong className="flex items-center text-gray-800">
                      Run Trigger
                    </strong>
                    {integration.trigger}
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center justify-center gap-10 py-4">
                <div>
                  <div className="flex justify-center  gap-10 py-4">
                    <div>
                      <label for="date-filter" className="font-bold">
                        Time Filter:
                      </label>
                      <select
                        id="date-filter"
                        value={daysFilter}
                        onChange={handleFilterWeek}
                        className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={1}>24 hours</option>
                        <option value={3}>3 days</option>
                        <option value={7}>one week</option>
                      </select>
                    </div>
                    <div className="w-100 flex justify-evenly">
                      <button
                        className="py-2 px-4 rounded border border-2 m-1 hover:bg-blue-200 "
                        onClick={() => {
                          handleFilterWeek(7)
                        }}
                      >
                        Last Week
                      </button>
                      <button
                        className="py-2 px-4 rounded border border-2 m-1 hover:bg-blue-200 "
                        onClick={() => {
                          handleFilterWeek(3)
                        }}
                      >
                        Last 3 Days
                      </button>
                      <button
                        className="py-2 px-4 rounded border border-2 m-1 hover:bg-blue-200 "
                        onClick={() => {
                          handleFilterWeek(1)
                        }}
                      >
                        Last 24 Hours
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="bg-white rounded-xl mt-2">
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

                {/* <div className="flex flex-col lg:flex-row justify-center  items-center mb-[10px] p-2 bg-white rounded-xl shadow-xl">
                <Chart
                  chartType="PieChart"
                  data={data}
                  options={options}
                  width={'400px'}
                  height={'300px'}
                />

                <BarChart2
                  integration={integration}
                  runs={integrationRuns}
                  daysFilter={daysFilter}
                />
              </div> */}

                {/* listing all the integration of rsl customer  */}

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
                        <th className="px-6 py-3 text-center text-sm font-medium bg-main-blue text-white uppercase w-auto">
                          Message
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
                            {run.runTotalTime} mins
                          </td>
                          <td
                            className={`px-6 py-3 overflow-hidden text-sm ${
                              run.errorMsg ? 'bg-red-200' : 'text-gray-500'
                            }`}
                          >
                            {run.errorMsg ? run.errorMsg : ''}
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
