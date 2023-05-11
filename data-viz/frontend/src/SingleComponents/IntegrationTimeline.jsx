import '../styles/AdminTimeline.css'
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
  VictoryLabel,
} from 'victory'
import { subDays, subHours, addDays, format } from 'date-fns'
import { GlobalContext } from '../context/GlobalState.jsx'
import '../styles/AdminTimeline.css'

import Loading from './Loading'

function IntegrationTimeline({ integrationId, runId = '' }) {
  // FOR DEVELOPMENT -- now date
  let now = new Date(Date.UTC(2022, 10, 14, 23, 0, 0, 0)) // Date as UTC to match all run start + end dates

  // FOR PRODUCTION -- uncomment below block
  // let now = new Date()
  // now = new Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds())

  // Set end date as the start of tomorrow
  const tomorrow = addDays(now, 1)
  const endDate = new Date(
    Date.UTC(
      tomorrow.getUTCFullYear(),
      tomorrow.getUTCMonth(),
      tomorrow.getUTCDate(),
      0,
      0,
      0,
      0
    )
  )

  const [readyToRender, setReadyToRender] = useState('')
  const [integration, setIntegration] = useState()
  const [data, setData] = useState()
  const [zoomDomain, setZoomDomain] = useState()

  const navigate = useNavigate()
  const context = useContext(GlobalContext)

  useEffect(() => {
    if (context.runs.length > 0) {
      // Set integration
      const [integration] = context.integrations.filter(
        (integration) => integration.id === integrationId
      )
      setIntegration(integration)

      // Set runs data
      const data = context.runs.filter((run) => run.pk === integrationId)
      setData(data)

      if (integration && data.length > 0) {
        setReadyToRender('ready')
        dayFilter(7)
      }
    }
  }, [context, integrationId, runId])

  const dates = () => {
    let dates = [endDate]

    for (let i = 1; i < 8; i++) {
      const date = subDays(endDate, i)
      dates.push(date)
    }

    return dates
  }

  const formatDate = (date) => {
    const newDate = addDays(date, 1)
    return format(newDate, 'MMM d')
  }

  const getDatumColor = (datum) => {
    if (datum.id === runId) {
      return 'purple'
    } else if (datum.run_status === 'failed') {
      return 'red'
    } else if (datum.run_status === 'in progress') {
      return '#F0BC39'
    } else {
      return '#006666'
    }
  }

  const getDatumOpacity = (datum) => {
    if (datum.id === runId) {
      return 1
    } else if (datum.run_status === 'success') {
      return 0.5
    } else {
      return 1
    }
  }

  const getStatusColour = (status) => {
    if (status === 'success') {
      return '#4BC940'
    } else if (status === 'in progress') {
      return '#F0BC39'
    } else {
      return 'red'
    }
  }

  const formatTime = (time) => {
    const t = new Date(time)
    let minutes = ''
    let seconds = ''
    t.getUTCMinutes() < 10
      ? (minutes = `0${t.getUTCMinutes()}`)
      : (minutes = `${t.getUTCMinutes()}`)
    t.getUTCSeconds() < 10
      ? (seconds = `0${t.getUTCSeconds()}`)
      : (seconds = `${t.getUTCSeconds()}`)
    return `${t.getUTCHours()}:${minutes}:${seconds}`
  }

  const hourFilter = (hours) => {
    const startDate = subHours(now, hours)
    const newDomain = {
      x: [0, 2],
      y: [startDate, now],
    }
    setZoomDomain(newDomain)
  }

  const dayFilter = (days) => {
    const startDate = subDays(endDate, days)
    const newDomain = {
      x: [0, 2],
      y: [startDate, endDate],
    }
    setZoomDomain(newDomain)
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {!context.loggedUser && (
        <div className="text-center">Please select a user above.</div>
      )}
      {context.loggedUser && readyToRender === '' && <Loading />}
      {readyToRender === 'ready' && (
        <>
          <div className="w-100 flex justify-between pl-6 pr-16 items-center">
            <Link
              to={`/integrationDetails/${encodeURIComponent(integration.id)}`}
            >
              <p className="text-2xl font-normal">{integration.display_name}</p>
            </Link>
            <div className="w-100 flex justify-evenly">
              <button
                className="btn-light"
                onClick={() => {
                  dayFilter(7)
                }}
              >
                Last Week
              </button>
              <button
                className="btn-light"
                onClick={() => {
                  dayFilter(3)
                }}
              >
                Last 3 Days
              </button>
              <button
                className="btn-light"
                onClick={() => {
                  hourFilter(24)
                }}
              >
                Last 24 Hours
              </button>
            </div>
          </div>
          <div>
            <VictoryChart
              width={850}
              height={80}
              padding={{ top: 10, right: 50, bottom: 30, left: 50 }}
              domainPadding={{ x: 20 }}
              containerComponent={
                <VictoryZoomContainer
                  responsive={true}
                  zoomDimension="y"
                  zoomDomain={zoomDomain}
                  allowZoom={false}
                />
              }
            >
              <VictoryAxis
                style={{
                  grid: {
                    stroke: '#224044',
                    strokeWidth: 1.5,
                  },
                  axis: {
                    stroke: '#224044',
                    strokeWidth: 0,
                  },
                }}
                tickLabelComponent={<VictoryLabel text="" />}
              />
              <VictoryAxis
                dependentAxis={true}
                tickValues={dates()}
                tickLabelComponent={<VictoryLabel text="" />}
                style={{ grid: { stroke: '#224044', size: 5 } }}
              />
              <VictoryAxis
                dependentAxis={true}
                orientation="top"
                tickValues={dates()}
                tickLabelComponent={
                  <VictoryLabel text="" textAnchor="middle" dy={5} />
                }
                style={{ grid: { stroke: '#224044', size: 5 } }}
              />
              <VictoryAxis
                dependentAxis={true}
                tickValues={dates()}
                tickFormat={(t) => formatDate(t)}
                tickLabelComponent={<VictoryLabel textAnchor="middle" dy={5} />}
                style={{ grid: { stroke: '#224044', size: 5 } }}
              />
              <VictoryBar
                horizontal={true}
                style={{
                  data: {
                    fill: ({ datum }) => getDatumColor(datum),
                    stroke: ({ datum }) => getDatumColor(datum),
                    opacity: ({ datum }) => getDatumOpacity(datum),
                    strokeWidth: 2,
                    cursor: 'pointer',
                  },
                }}
                data={data}
                y={(d) =>
                  d.run_end
                    ? Date.parse(d.run_end)
                    : Date.parse(d.run_start) + 60
                } // if run is in progress, set y to a minute after, to display bar on chart
                y0={(d) => Date.parse(d.run_start)}
                barWidth={20}
                x="pk"
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onClick: () => {
                        return [
                          {
                            target: 'data',
                            mutation: (props) => {
                              return navigate(
                                `/rundetails/${encodeURIComponent(
                                  props.datum.id
                                )}`
                              )
                            },
                          },
                        ]
                      },
                    },
                  },
                ]}
                labels={({ datum }) => [
                  `${datum.id}`,
                  datum.run_status === 'in progress'
                    ? `Start Time: ${formatTime(datum.run_start)}`
                    : `${formatTime(datum.run_start)} to ${formatTime(
                        datum.run_end
                      )} — ${datum.runTotalTime} mins`,
                  datum.run_status.toUpperCase(),
                ]}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      fill: 'white',
                      stroke: ({ datum }) => getDatumColor(datum),
                      strokeWidth: 4,
                    }}
                    flyoutPadding={{
                      top: 20,
                      bottom: 20,
                      right: 16,
                      left: 16,
                    }}
                    orientation="bottom"
                    labelComponent={
                      <VictoryLabel
                        backgroundStyle={{ fill: 'white' }}
                        backgroundPadding={[
                          0,
                          0,
                          { top: 4, bottom: 2, right: 16, left: 16 },
                        ]}
                        lineHeight={[2, 1.2, 1.2, 1.7]}
                        style={[
                          {
                            fill: ({ datum }) => getDatumColor(datum),
                            fontWeight: 'bold',
                          },
                          { fill: 'black' },
                          {
                            fill: ({ datum }) =>
                              getStatusColour(datum.run_status),
                            fontWeight: 'bold',
                          },
                        ]}
                        id="label"
                      />
                    }
                  />
                }
              />
            </VictoryChart>
          </div>
        </>
      )}
    </div>
  )
}

export default IntegrationTimeline
