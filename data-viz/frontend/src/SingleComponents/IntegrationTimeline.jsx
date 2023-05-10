import '../styles/AdminTimeline.css'
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  const [readyToRender, setReadyToRender] = useState('')
  const [integration, setIntegration] = useState()
  const [data, setData] = useState()
  const [zoomDomain, setZoomDomain] = useState()

  const navigate = useNavigate()
  const context = useContext(GlobalContext)

  const { integrationId } = useParams()

  useEffect(() => {
    if (context.runs.length > 0) {
      // set integration
      const [integration] = context.integrations.filter(
        (integration) => integration.id === integrationId
      )
      setIntegration(integration)

      // set runs data
      const data = context.runs.filter((run) => run.pk === integrationId)
      setData(data)

      console.log('this is the int', integration)

      if (integration && data.length > 0) {
        setReadyToRender('ready')
        dayFilter(7)
      }
    }
  }, [context])

  // TEMPORARY NOW
  let now = new Date(Date.UTC(2022, 10, 14, 23, 0, 0, 0)) // replace this line with now as UTC
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

  const handleBrush = (domain) => {
    const newDomain = {
      x: [0, integrationsByCompany.length + 1],
      y: [domain.y[0], domain.y[1]],
    }
    setZoomDomain(newDomain)
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

  const handleZoom = (domain) => {
    const newDomain = {
      x: [0, integrationsByCompany.length + 1],
      y: [domain.y[0], domain.y[1]],
    }
    setSelectedDomain(newDomain)
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {readyToRender === 'ready' && (
        <>
          <div className="w-100 flex justify-between pl-6 pr-16 items-center">
            <p className="text-xl font-normal">{integration.display_name}</p>
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
                tickLabelComponent={<VictoryLabel text="" />}
              />
              <VictoryAxis
                dependentAxis={true}
                tickValues={dates()}
                tickLabelComponent={<VictoryLabel text="" />}
                style={{ grid: { stroke: 'grey', size: 5 } }}
              />
              <VictoryAxis
                dependentAxis={true}
                orientation="top"
                tickValues={dates()}
                tickLabelComponent={
                  <VictoryLabel text="" textAnchor="middle" dy={5} />
                }
                style={{ grid: { stroke: 'grey', size: 5 } }}
              />
              <VictoryAxis
                dependentAxis={true}
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
                  `${integration.display_name}`,
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
