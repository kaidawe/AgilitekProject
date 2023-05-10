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
} from 'victory'
import { subDays, subHours, addDays, format } from 'date-fns'
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

function AdminTimeline() {
  const navigate = useNavigate()
  const context = useContext(GlobalContext)

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

  const [selectedDomain, setSelectedDomain] = useState()
  const [zoomDomain, setZoomDomain] = useState()
  const [companies, setCompanies] = useState([])
  const [integrationsByCompany, setIntegrationsByCompany] = useState([])

  useEffect(() => {
    if (context.runs.length > 0) {
      constructCompanyObjects()
    }
  }, [context])

  useEffect(() => {
    dayFilter(7)
  }, [companies])

  const constructCompanyObjects = () => {
    let companyObjectArray = []
    let allIntegrations = []
    let tickCounter = 0
    context.customers.forEach((company) => {
      const companyRuns = getCompanyRuns(company)
      if (companyRuns.length > 0) {
        let companyIntegrations = []
        let companyTicks = []
        companyRuns.forEach((run) => {
          const integration = context.integrations.filter(
            (integration) => integration.id === run.pk
          )
          companyIntegrations.push(integration[0])
        })
        let uniqueCompanyIntegrations = [...new Set(companyIntegrations)]

        // add to central integration array
        allIntegrations = [...allIntegrations, ...uniqueCompanyIntegrations]

        // define ticks
        uniqueCompanyIntegrations.forEach((int) => {
          tickCounter += 1
          const tick = tickCounter
          companyTicks.push(tick)

          // check integration status
          // check status
          let integrationStatus = ''
          let failedRuns = companyRuns.filter(
            (run) => run.run_status === 'failed' && run.pk === int.id
          )
          let progressRuns = companyRuns.filter(
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
          int.statusColour = getStatusColour(int.status)
        })

        const companyObject = {
          name: company,
          integrations: uniqueCompanyIntegrations,
          ticks: companyTicks,
        }

        // add icons
        if (company === 'DUCKS') {
          companyObject.icon = ducks_icon
        }

        if (company === 'RSL') {
          companyObject.icon = rsl_icon
        }

        if (company === 'OILERS') {
          companyObject.icon = oilers_icon
        }

        if (company === 'BSE') {
          companyObject.icon = bse_icon
        }

        if (company === 'WILD') {
          companyObject.icon = wild_icon
        }

        if (company === 'GULLS') {
          companyObject.icon = gulls_icon
        }

        if (company === 'SWARM') {
          companyObject.icon = swarm_icon
        }

        if (company === 'CAVALIERS') {
          companyObject.icon = cavaliers_icon
        }

        companyObjectArray.push(companyObject)
      }
    })
    setIntegrationsByCompany(allIntegrations)
    setCompanies(companyObjectArray)
  }

  useEffect(() => {
    updateIntegrationStatuses()
  }, [zoomDomain, selectedDomain])

  const updateIntegrationStatuses = () => {
    const integrations = integrationsByCompany
    integrations.forEach((int) => {
      const integrationRuns = context.runsByIntegration[int.id]
      let integrationStatus = ''
      let failedRuns = integrationRuns.filter(
        (run) =>
          run.run_status === 'failed' &&
          run.pk === int.id &&
          Date.parse(run.run_start) > selectedDomain.y[0] &&
          Date.parse(run.run_start) < selectedDomain.y[1]
      )
      let progressRuns = integrationRuns.filter(
        (run) =>
          run.run_status === 'in progress' &&
          run.pk === int.id &&
          Date.parse(run.run_start) > selectedDomain.y[0] &&
          Date.parse(run.run_start) < selectedDomain.y[1]
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
      int.statusColour = getStatusColour(int.status)
    })
    setIntegrationsByCompany(integrations)
  }

  const getCompanyRuns = (company) => {
    let companyRuns = []
    const companyIntegrations = context.integrationsByCustomer[company]
    companyIntegrations.forEach((integration) => {
      const runs = context.runs.filter((run) => run.pk === integration.id)
      companyRuns = [...companyRuns, ...runs]
    })
    return companyRuns
  }

  // const tickToIntegrationId = (tick) => {
  //   return integrationsByCompany[tick - 1].id
  // }

  // const tickToIntegrationName = (tick) => {
  //   return integrationsByCompany[tick - 1].display_name
  // }

  const integrationToTick = (integrationId) => {
    return integrationsByCompany.findIndex(
      (integration) => integration.id === integrationId
    )
  }

  const handleZoom = (domain) => {
    const newDomain = {
      x: [0, integrationsByCompany.length + 1],
      y: [domain.y[0], domain.y[1]],
    }
    setSelectedDomain(newDomain)
  }

  const handleBrush = (domain) => {
    const newDomain = {
      x: [0, integrationsByCompany.length + 1],
      y: [domain.y[0], domain.y[1]],
    }
    setZoomDomain(newDomain)
    setSelectedDomain(newDomain)
  }

  const hourFilter = (hours) => {
    const startDate = subHours(now, hours)
    const newDomain = {
      x: [0, integrationsByCompany.length + 1],
      y: [startDate, now],
    }
    setZoomDomain(newDomain)
    setSelectedDomain(newDomain)
  }

  const dayFilter = (days) => {
    const startDate = subDays(endDate, days)
    const newDomain = {
      x: [0, integrationsByCompany.length + 1],
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
      return '#006666'
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

  const DataLabel = (props) => {
    const x = props.scale.x(props.x)
    const y = props.scale.y(props.y)
    return <VictoryLabel {...props} x={y} y={x} /> // props are flipped due for horizontal bar chart
  }

  const getIntegrationName = (pk) => {
    const [integration] = integrationsByCompany.filter(
      (integration) => integration.id === pk
    )
    return integration.display_name
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

  // const highlightErrors = () => {

  // }

  return (
    <div className="bg-white shadow rounded-lg p-4">
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
            height={integrationsByCompany.length * 20}
            domainPadding={{ x: [8, 8], y: [0, 0] }}
            padding={{ top: 30, right: 0, bottom: 50, left: 0 }}
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
              axisValue={integrationsByCompany.length + 1}
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
              tickLabelComponent={<VictoryLabel text="" />}
            />
            <VictoryAxis
              style={{ grid: { stroke: '#223F44', size: 5 } }}
              tickLabelComponent={<VictoryLabel text="" />}
            />
            {companies &&
              companies.map((company, i) => {
                return (
                  <VictoryBar
                    key={i}
                    horizontal={true}
                    style={{
                      data: {
                        fill: '#223F44',
                        stroke: '#223F44',
                        strokeWidth: 1,
                      },
                    }}
                    data={getCompanyRuns(company.name)}
                    y={(d) =>
                      d.run_end
                        ? Date.parse(d.run_end)
                        : Date.parse(d.run_start)
                    } // if run is in progress, set y to run start time
                    y0={(d) => Date.parse(d.run_start)}
                    barWidth={6}
                    x="pk"
                  />
                )
              })}
          </VictoryChart>
        </div>
      </div>
      <div>
        {integrationsByCompany.length && (
          <VictoryChart
            width={850}
            height={integrationsByCompany.length * 40}
            padding={{ top: 25, right: 50, bottom: 50, left: 100 }}
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
            {integrationsByCompany &&
              integrationsByCompany.map((integration, i) => {
                const tick = integrationToTick(integration.id)
                return (
                  <DataLabel
                    key={i}
                    dx={60}
                    dy={-42}
                    x={tick}
                    text="."
                    lineHeight={1.5}
                    textAnchor="end"
                    verticalAnchor="middle"
                    style={{
                      fill: () => {
                        return integration.statusColour
                      },
                      fontSize: 60,
                      fontFamily: 'Source Code Pro',
                    }}
                  />
                )
              })}
            {integrationsByCompany &&
              integrationsByCompany.map((integration, i) => {
                const companyName = integration.pk
                const company = companies.find((obj) => {
                  return obj.name === companyName
                })
                const tick = integrationToTick(integration.id)
                const id = integration.id
                return (
                  <DataLabel
                    key={i}
                    dx={100}
                    dy={-25}
                    x={tick}
                    text="."
                    lineHeight={1.5}
                    textAnchor="end"
                    verticalAnchor="middle"
                    backgroundStyle={{
                      fill: 'white',
                    }}
                    backgroundPadding={{
                      right: 0,
                      left: 50,
                    }}
                    style={{
                      fill: 'white',
                      fontSize: 18,
                      fontFamily: 'Source Code Pro',
                    }}
                    backgroundComponent={
                      <image
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          navigate(
                            `/integrationDetails/${encodeURIComponent(id)}`
                          )
                        }
                        href={company.icon}
                      ></image>
                    }
                  />
                )
              })}

            <VictoryAxis
              style={{
                grid: {
                  stroke: 'RGBA(34, 64, 68, 1)',
                  strokeWidth: 0.5,
                },
              }}
              tickLabelComponent={<VictoryLabel text="" />}
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
              axisValue={integrationsByCompany.length + 1}
              orientation="top"
              tickValues={dates()}
              tickFormat={(t) => formatDate(t)}
              tickLabelComponent={<VictoryLabel textAnchor="middle" dy={5} />}
              style={{ grid: { stroke: 'grey', size: 5 } }}
            />
            {companies &&
              companies.map((company, i) => {
                const companyName = company.name
                return (
                  <VictoryBar
                    key={i}
                    horizontal={true}
                    style={{
                      data: {
                        fill: ({ datum }) => getDatumColor(datum),
                        stroke: ({ datum }) => getDatumColor(datum),
                        opacity: ({ datum }) =>
                          datum.run_status === 'success' && 0.5,
                        strokeWidth: 2,
                        cursor: 'pointer',
                      },
                    }}
                    data={getCompanyRuns(company.name)}
                    y0={(d) =>
                      d.run_end
                        ? Date.parse(d.run_end)
                        : Date.parse(d.run_start) + 60
                    } // if run is in progress, set y to a minute after, to display bar on chart
                    y={(d) => Date.parse(d.run_start)}
                    barWidth={10}
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
                          stroke: '#006666',
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
                                fill: '#224044',
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
                )
              })}
          </VictoryChart>
        )}
      </div>
    </div>
  )
}

export default AdminTimeline
