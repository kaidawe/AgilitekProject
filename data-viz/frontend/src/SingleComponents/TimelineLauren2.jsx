import React from 'react'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryScatter,
  VictoryAxis,
  VictoryLine,
  VictoryBar,
  VictoryBrushContainer,
} from 'victory'

class TimelineLauren2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleZoom(domain) {
    this.setState({ selectedDomain: domain })
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain })
  }

  render() {
    return (
      <div>
        <VictoryChart
          width={600}
          height={180}
          scale={{ x: 'time' }}
          domainPadding={20}
          containerComponent={
            <VictoryZoomContainer
              responsive={false}
              zoomDimension="x"
              zoomDomain={this.state.zoomDomain}
              allowZoom={false}
              onZoomDomainChange={this.handleZoom.bind(this)}
            />
          }
        >
          <VictoryAxis
            dependentAxis={true}
            style={{ grid: { stroke: 'grey', size: 5 } }}
          />
          <VictoryAxis />
          <VictoryScatter
            style={{
              data: { stroke: 'tomato' },
            }}
            data={[
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679665259',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-24T13:40:59.000000+0000',
                run_end: '2023-03-24T15:39:07.000000+0000',
                runTotalTime: '118.13',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679622048',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-24T01:40:48.000000+0000',
                run_end: '2023-03-24T03:44:32.000000+0000',
                runTotalTime: '123.73',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679578874',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-23T13:41:14.000000+0000',
                run_end: '2023-03-23T16:14:43.000000+0000',
                runTotalTime: '153.48',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679535651',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-23T01:40:51.000000+0000',
                run_end: '2023-03-23T03:43:55.000000+0000',
                runTotalTime: '123.07',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679492452',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-22T13:40:52.000000+0000',
                run_end: '2023-03-22T15:40:27.000000+0000',
                runTotalTime: '119.58',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679449257',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-22T01:40:57.000000+0000',
                run_end: '2023-03-22T03:41:35.000000+0000',
                runTotalTime: '120.63',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679406076',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-21T13:41:16.000000+0000',
                run_end: '2023-03-21T15:36:39.000000+0000',
                runTotalTime: '115.38',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679362868',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-21T01:41:08.000000+0000',
                run_end: '2023-03-21T03:38:31.000000+0000',
                runTotalTime: '117.38',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679319652',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-20T13:40:52.000000+0000',
                run_end: '2023-03-20T16:08:54.000000+0000',
                runTotalTime: '148.03',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679276451',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-20T01:40:51.000000+0000',
                run_end: '2023-03-20T03:31:52.000000+0000',
                runTotalTime: '111.02',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679233248',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-19T13:40:48.000000+0000',
                run_end: '2023-03-19T15:30:44.000000+0000',
                runTotalTime: '109.93',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679190049',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-19T01:40:49.000000+0000',
                run_end: '2023-03-19T03:35:45.000000+0000',
                runTotalTime: '114.93',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679103651',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-18T01:40:51.000000+0000',
                run_end: '2023-03-18T03:39:22.000000+0000',
                runTotalTime: '118.52',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679060426',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-17T13:40:26.000000+0000',
                run_end: '2023-03-17T15:37:05.000000+0000',
                runTotalTime: '116.65',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679017228',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-17T01:40:28.000000+0000',
                run_end: '2023-03-17T03:37:44.000000+0000',
                runTotalTime: '117.27',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679581734',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-23T14:28:54.000000+0000',
                run_end: '2023-03-23T14:29:32.000000+0000',
                runTotalTime: '0.63',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679556535',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-23T07:28:55.000000+0000',
                run_end: '2023-03-23T07:29:27.000000+0000',
                runTotalTime: '0.53',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679495314',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-22T14:28:34.000000+0000',
                run_end: '2023-03-22T14:29:10.000000+0000',
                runTotalTime: '0.60',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679304481',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-20T09:28:01.000000+0000',
                run_end: '2023-03-20T09:28:41.000000+0000',
                runTotalTime: '0.67',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679275678',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-20T01:27:58.000000+0000',
                run_end: '2023-03-20T01:28:31.000000+0000',
                runTotalTime: '0.55',
                errorMsg: null,
              },
            ]}
            x={(d) => Date.parse(d.run_start)}
            x0={(d) => Date.parse(d.run_end)}
            y="pk"
            size={10}
            // width="runTotalTime"
          />
        </VictoryChart>

        <VictoryChart
          padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
          width={600}
          height={70}
          scale={{ x: 'time' }}
          domainPadding={20}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              brushDimension="x"
              brushDomain={this.state.selectedDomain}
              onBrushDomainChange={this.handleBrush.bind(this)}
            />
          }
        >
          <VictoryAxis />
          <VictoryScatter
            style={{
              data: { stroke: 'tomato' },
            }}
            data={[
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679665259',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-24T13:40:59.000000+0000',
                run_end: '2023-03-24T15:39:07.000000+0000',
                runTotalTime: '118.13',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679622048',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-24T01:40:48.000000+0000',
                run_end: '2023-03-24T03:44:32.000000+0000',
                runTotalTime: '123.73',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679578874',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-23T13:41:14.000000+0000',
                run_end: '2023-03-23T16:14:43.000000+0000',
                runTotalTime: '153.48',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679535651',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-23T01:40:51.000000+0000',
                run_end: '2023-03-23T03:43:55.000000+0000',
                runTotalTime: '123.07',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679492452',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-22T13:40:52.000000+0000',
                run_end: '2023-03-22T15:40:27.000000+0000',
                runTotalTime: '119.58',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679449257',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-22T01:40:57.000000+0000',
                run_end: '2023-03-22T03:41:35.000000+0000',
                runTotalTime: '120.63',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679406076',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-21T13:41:16.000000+0000',
                run_end: '2023-03-21T15:36:39.000000+0000',
                runTotalTime: '115.38',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679362868',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-21T01:41:08.000000+0000',
                run_end: '2023-03-21T03:38:31.000000+0000',
                runTotalTime: '117.38',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679319652',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-20T13:40:52.000000+0000',
                run_end: '2023-03-20T16:08:54.000000+0000',
                runTotalTime: '148.03',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679276451',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-20T01:40:51.000000+0000',
                run_end: '2023-03-20T03:31:52.000000+0000',
                runTotalTime: '111.02',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679233248',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-19T13:40:48.000000+0000',
                run_end: '2023-03-19T15:30:44.000000+0000',
                runTotalTime: '109.93',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679190049',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-19T01:40:49.000000+0000',
                run_end: '2023-03-19T03:35:45.000000+0000',
                runTotalTime: '114.93',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679103651',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-18T01:40:51.000000+0000',
                run_end: '2023-03-18T03:39:22.000000+0000',
                runTotalTime: '118.52',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679060426',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-17T13:40:26.000000+0000',
                run_end: '2023-03-17T15:37:05.000000+0000',
                runTotalTime: '116.65',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679017228',
                pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
                run_start: '2023-03-17T01:40:28.000000+0000',
                run_end: '2023-03-17T03:37:44.000000+0000',
                runTotalTime: '117.27',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679581734',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-23T14:28:54.000000+0000',
                run_end: '2023-03-23T14:29:32.000000+0000',
                runTotalTime: '0.63',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679556535',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-23T07:28:55.000000+0000',
                run_end: '2023-03-23T07:29:27.000000+0000',
                runTotalTime: '0.53',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679495314',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-22T14:28:34.000000+0000',
                run_end: '2023-03-22T14:29:10.000000+0000',
                runTotalTime: '0.60',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679304481',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-20T09:28:01.000000+0000',
                run_end: '2023-03-20T09:28:41.000000+0000',
                runTotalTime: '0.67',
                errorMsg: null,
              },
              {
                log_details: 'missing link',
                run_status: 'success',
                id: 'RUN#1679275678',
                pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
                run_start: '2023-03-20T01:27:58.000000+0000',
                run_end: '2023-03-20T01:28:31.000000+0000',
                runTotalTime: '0.55',
                errorMsg: null,
              },
            ]}
            x={(d) => Date.parse(d.run_start)}
            y="pk"
            size={3}
            // width="runTotalTime"
          />
        </VictoryChart>
      </div>
    )
  }
}

export default TimelineLauren2
