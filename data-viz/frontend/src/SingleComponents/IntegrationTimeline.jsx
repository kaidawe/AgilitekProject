import '../styles/AdminTimeline.css'
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryAxis,
  VictoryBar,
  VictoryBrushContainer,
  VictoryTooltip,
  VictoryLabel,
  Bar,
  Rect,
  Circle,
  Background,
} from 'victory'
import {
  subDays,
  endOfDay,
  subHours,
  startOfDay,
  addDays,
  format,
} from 'date-fns'
import { GlobalContext } from '../context/GlobalState.jsx'
import '../styles/AdminTimeline.css'
import ducks_icon from '../images/ducks_icon.png'
import rsl_icon from '../images/rsl_icon.png'
import oilers_icon from '../images/oilers_icon.png'
import bse_icon from '../images/bse_icon.png'
import wild_icon from '../images/wild_icon.png'
import gulls_icon from '../images/gulls_icon.png'
import swarm_icon from '../images/swarm_icon.png'
import cavaliers_icon from '../images/cavaliers_icon.png'

function IntegrationTimeline() {
  const navigate = useNavigate()
  const context = useContext(GlobalContext)

  // CONTEXT DATA
  const allIntegrations = context.integrations

  // END OF CONTEXT DATA

  const [data, setData] = useState([])
  const [integration, setIntegration] = useState()
  const [readyToRender, setReadyToRender] = useState('')

  useEffect(() => {
    if (context.runs.length > 0 && context.integrations.length > 0) {
      let integrations = []
      context.runs.forEach((run) => {
        const integration = allIntegrations.filter(
          (integration) => integration.id === run.pk
        )
        integrations.push(integration[0])
      })
      let uniqueIntegrations = [...new Set(integrations)]

      uniqueIntegrations.forEach((int) => {
        let integrationStatus = ''
        let failedRuns = context.runs.filter(
          (run) => run.run_status === 'failed' && run.pk === int.id
        )
        let progressRuns = context.runs.filter(
          (run) => run.run_status === 'in progress' && run.pk === int.id
        )
        if (failedRuns.length === 0) {
          if (progressRuns.length === 0) {
            integrationStatus = 'success'
          } else {
            integrationStatus = 'in progress'
          }
        } else {
          integrationStatus = 'failed'
        }

        int.status = integrationStatus
      })

      setIntegrations(uniqueIntegrations)
      console.log(integrations)
      console.log(integrations)
      if (integrations.length > 0) {
        setData(context.runs)
      }
    }
  }, [context])

  useEffect(() => {
    if (integrations.length > 0 && data.length > 0) {
      console.log('int length', integrations.length)
      dayFilter(7)
      setReadyToRender('ready')
    }
  }, [integrations, data])

  const handleZoom = (domain) => {
    const newDomain = {
      x: [0, integrations.length + 1],
      y: [domain.y[0], domain.y[1]],
    }
    setSelectedDomain(newDomain)
  }

  const handleBrush = (domain) => {
    const newDomain = {
      x: [0, integrations.length + 1],
      y: [domain.y[0], domain.y[1]],
    }
    setZoomDomain(newDomain)
  }

  const hourFilter = (hours) => {
    const startDate = subHours(now, hours)
    const newDomain = {
      x: [0, integrations.length + 1],
      y: [startDate, now],
    }
    setZoomDomain(newDomain)
    setSelectedDomain(newDomain)
  }

  const dayFilter = (days) => {
    const startDate = subDays(endDate, days)
    const newDomain = {
      x: [0, integrations.length + 1],
      y: [startDate, endDate],
    }
    setZoomDomain(newDomain)
    setSelectedDomain(newDomain)
  }

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
    if (datum.run_status === 'failed') {
      return 'red'
    } else if (datum.run_status === 'in progress') {
      return '#F0BC39'
    } else {
      return 'grey'
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

  const getIntegrationName = (pk) => {
    const [integration] = integrations.filter(
      (integration) => integration.id === pk
    )
    return integration.display_name
  }

  const getIntegrationAxisLabel = (pk) => {
    const name = getIntegrationName(pk)
    console.log('name', name)
    let formattedName = ''
    if (name.length > 15) {
      const nameArray = name.split(' ')
      for (let i = 0; i < nameArray.length; i++) {
        if (i === Math.round(nameArray.length * 0.6)) {
          formattedName = formattedName + '\n' + nameArray[i]
        } else {
          formattedName = formattedName + ' ' + nameArray[i]
        }
      }
    } else {
      formattedName = name
    }
    return formattedName
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

  const getIntegrationStatusColour = (tick) => {
    const integration = integrations[tick - 1]
    return getStatusColour(integration.status)
  }

  const DataLabel = (props) => {
    const x = props.scale.x(props.x)
    const y = props.scale.y(props.y)
    return <VictoryLabel {...props} x={y} y={x} /> // props are flipped due for horizontal bar chart
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {readyToRender === 'ready' && (
        <>
          <div className="flex justify-evenly items-end">
            <div className="text-center">
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
              <VictoryChart
                width={600}
                height={110 + (integrations.length - 1) * 15}
                domain={{ x: [0, integrations.length] }}
                // scale={{ y: 'time' }}
                // domainPadding={{ x: [8, 8], y: [0, 0] }}
                padding={{ top: 60, right: 0, bottom: 30, left: 0 }}
                containerComponent={
                  <VictoryBrushContainer
                    responsive={false}
                    brushDimension="y"
                    brushDomain={selectedDomain}
                    onBrushDomainChange={handleBrush}
                    brushStyle={{ fill: 'teal', opacity: 0.2 }}
                  />
                }
              >
                <VictoryAxis
                  dependentAxis={true}
                  axisValue={integrations.length + 1}
                  orientation="top"
                  tickValues={dates()}
                  tickFormat={(t) => formatDate(t)}
                  tickLabelComponent={
                    <VictoryLabel textAnchor="start" dx={20} dy={5} />
                  }
                  style={{ grid: { stroke: 'grey', size: 5 } }}
                />
                <VictoryAxis
                  dependentAxis={true}
                  tickValues={dates()}
                  style={{ grid: { stroke: 'grey', size: 5 } }}
                  tickLabelComponent={<VictoryLabel text="" />}
                />
                <VictoryAxis
                  style={{ grid: { stroke: '#223F44', size: 5 } }}
                  tickLabelComponent={<VictoryLabel text="" />}
                />
                <VictoryBar
                  horizontal={true}
                  style={{
                    data: {
                      fill: '#223F44',
                      stroke: '#223F44',
                      strokeWidth: 1,
                    },
                  }}
                  data={data}
                  y={(d) =>
                    d.run_end ? Date.parse(d.run_end) : Date.parse(d.run_start)
                  } // if run is in progress, set y to run start time
                  y0={(d) => Date.parse(d.run_start)}
                  barWidth={6}
                  x="pk"
                />
              </VictoryChart>
            </div>
          </div>
          <div>
            <VictoryChart
              width={850}
              height={150 + (integrations.length - 1) * 50}
              // scale={{ y: 'time' }}
              padding={{ top: 25, right: 50, bottom: 50, left: 180 }}
              domainPadding={{ x: 20 }}
              // domain={{ x: [0, integrationsByCompany.length] }}
              containerComponent={
                <VictoryZoomContainer
                  responsive={true}
                  zoomDimension="y"
                  zoomDomain={zoomDomain}
                  allowZoom={false}
                  onZoomDomainChange={handleZoom}
                />
              }
            >
              <VictoryAxis
                style={{
                  grid: {
                    stroke: 'grey',
                    strokeWidth: 1.5,
                  },
                  axis: {
                    stroke: 'grey',
                    strokeWidth: 0,
                  },
                }}
                tickFormat={(t) => getIntegrationAxisLabel(t)}
                tickLabelComponent={<VictoryLabel dx={-10} />}
              />
              <VictoryAxis
                style={{
                  grid: {
                    stroke: 'grey',
                    strokeWidth: 0,
                  },
                  axis: {
                    stroke: 'grey',
                    strokeWidth: 0,
                  },
                }}
                tickLabelComponent={
                  <VictoryLabel
                    text="."
                    dx={20}
                    dy={-16}
                    style={{
                      fill: (t) => {
                        return getIntegrationStatusColour(t.datum)
                      },
                      fontSize: 60,
                      fontFamily: 'Source Code Pro',
                    }}
                  />
                }
              />
              <VictoryAxis
                dependentAxis={true}
                tickValues={dates()}
                tickFormat={(t) => formatDate(t)}
                tickLabelComponent={<VictoryLabel textAnchor="middle" dy={5} />}
                style={{ grid: { stroke: 'grey', size: 5 } }}
              />
              <VictoryAxis
                dependentAxis={true}
                axisValue={integrations.length + 1}
                orientation="top"
                tickValues={dates()}
                tickFormat={(t) => formatDate(t)}
                tickLabelComponent={<VictoryLabel textAnchor="middle" dy={5} />}
                style={{ grid: { stroke: 'grey', size: 5 } }}
              />
              <VictoryBar
                horizontal={true}
                style={{
                  data: {
                    fill: ({ datum }) => getDatumColor(datum),
                    stroke: ({ datum }) => getDatumColor(datum),
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
                              return navigate(`/runs/${props.datum.id}`)
                            },
                          },
                        ]
                      },
                    },
                  },
                ]}
                labels={({ datum }) => [
                  `${getIntegrationName(datum.pk)}`,
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
                      stroke: 'grey',
                      strokeWidth: 4,
                    }}
                    flyoutPadding={{
                      top: 20,
                      bottom: 20,
                      right: 16,
                      left: 16,
                    }}
                    orientation="top"
                    labelComponent={
                      <VictoryLabel
                        backgroundStyle={{ fill: 'white' }}
                        backgroundPadding={[
                          0,
                          0,
                          0,
                          { top: 2, bottom: 2, right: 16, left: 16 },
                        ]}
                        lineHeight={[2, 1.2, 1.2, 1.7]}
                        style={[
                          {
                            fill: 'grey',
                            fontWeight: 'bold',
                          },
                          { fill: 'black' },
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
