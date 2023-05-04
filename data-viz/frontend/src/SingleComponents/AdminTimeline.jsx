import React from 'react'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryAxis,
  VictoryBar,
  VictoryBrushContainer,
  VictoryTooltip,
  VictoryLabel,
  VictoryGroup,
} from 'victory'
import { useState } from 'react'
import '../styles/AdminTimeline.css'

function AdminTimeline() {
  // STATIC DATA
  const companies = [
    'LIVENATION',
    'DUCKS',
    'RSL',
    'OILERS',
    'BSE',
    'LNPSS',
    'WILD',
    'DYNAMO',
    'GULLS',
    'SWARM',
    'TEST',
    'CAVALIERS',
  ]

  const integrations = [
    {
      short_description: 'SFDC Outbound to LiveAnalytics',
      trigger: 'Schedule - Daily',
      data_destination: 'SFDC',
      integration_name: 'liven_sfdc_push',
      cls: 'Integration',
      original_data_source: 'Live Analytics',
      pk: 'LIVENATION',
      id: 'INTEGRATION#01G75PQKF17EPQVD4Z7XWBGQQS',
      display_name: 'SFDC Outbound',
      data_source: 'LiveA SFTP',
    },
    {
      short_description: 'Inbound Connector: Tradedesk',
      trigger: 'Hourly',
      data_destination: 'Azure SQL Server',
      integration_name: 'ducks_tradedesk_inbound',
      cls: 'Integration',
      original_data_source: 'Tradedesk (ZeroHero)',
      pk: 'DUCKS',
      id: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
      display_name: 'Inbound Connector: Tradedesk',
      data_source: 'Tradedesk (ZeroHero)',
    },
    {
      short_description:
        'Sync contacts from SQL Server to an Eloqua CDO (archtics_ducks_current_ticket_owner_seat)',
      trigger: '5:00PM (PDT)',
      data_destination: 'Eloqua',
      integration_name: 'outbound_delivery_eloqua',
      cls: 'Integration',
      original_data_source: 'SQL Server',
      pk: 'DUCKS',
      id: 'INTEGRATION#01GHVDYH1YPWQBKDBZPS310KNG',
      display_name: 'Outbound Delivery: Eloqua',
      data_source: 'SQL Server',
    },
    {
      short_description: 'Inbound Connector: Fortress (Incremental)',
      trigger: 'Schedule - Hourly',
      data_destination: 'Azure',
      integration_name: 'fortress_sync_hourly',
      cls: 'Integration',
      original_data_source: 'Fortress API',
      pk: 'DUCKS',
      id: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
      display_name: 'Inbound Connector: Fortress (Incremental)',
      data_source: 'Fortress API',
    },
    {
      short_description:
        'Sync contacts from SQL Server to an Eloqua CDO (rinks_customer_by_email)',
      trigger: 'Nightly',
      data_destination: 'Eloqua',
      integration_name: 'outbound_delivery_eloqua',
      cls: 'Integration',
      original_data_source: 'SQL Server',
      pk: 'DUCKS',
      id: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      display_name: 'Outbound Delivery: Eloqua',
      data_source: 'SQL Server',
    },
    {
      short_description: 'Load data from AXS Redshift to Postgres',
      trigger: 'Schedule - Hourly from 11:00 p.m. - 5:00 p.m. (UTC)',
      data_destination: 'Postgres',
      integration_name: 'rsl_inbound_connector_axs_incremental',
      cls: 'Integration',
      original_data_source: 'AXS',
      pk: 'RSL',
      id: 'INTEGRATION#01G7FY02XJ145HE2TTJJRAE8BA',
      display_name: 'Inbound Connector: AXS (Incremental)',
      data_source: 'AXS',
    },
    {
      short_description: 'Sync Shopify to Postgres',
      trigger: 'Schedule - Nightly',
      data_destination: 'Postgres',
      integration_name: 'oilers_shopify_inbound',
      cls: 'Integration',
      original_data_source: 'Shopify',
      pk: 'OILERS',
      id: 'INTEGRATION#01GDGK8SV1ZRNA83Y9H9941XCE',
      display_name: 'Inbound Connector: Shopify (EOCF)',
      data_source: 'Shopify',
    },
    {
      short_description: 'Bump inbound to Postgres',
      trigger: 'Schedule - Nightly',
      data_destination: 'Postgres',
      integration_name: 'bump_inbound_oilers',
      cls: 'Integration',
      original_data_source: 'Bump',
      pk: 'OILERS',
      id: 'INTEGRATION#01GGDAVWKF95H89BKNTQV8RG8W',
      display_name: 'Inbound Connector: Bump (Oilers)',
      data_source: 'Bump',
    },
    {
      short_description: 'Inbound Connector: SFDC',
      trigger: 'Schedule - 3x Daily',
      data_destination: 'Postgres',
      integration_name: 'bse_sfdc_pull',
      cls: 'Integration',
      original_data_source: 'SFDC',
      pk: 'BSE',
      id: 'INTEGRATION#01G7WDEZQKHN4NT0HFSZYSVCQY',
      display_name: 'Inbound Connector: SFDC',
      data_source: 'SFDC',
    },
    {
      short_description: 'Nightly SFTP Fanatics Import for NY Liberty',
      trigger: 'Schedule - Nightly @ 10pm EST',
      data_destination: 'Postgres',
      integration_name: 'ny_liberty_fanatics',
      cls: 'Integration',
      original_data_source: 'Fanatics SFTP',
      pk: 'BSE',
      id: 'INTEGRATION#01G8EJY1NVJQKPX3FNFXVB3JQY',
      display_name: 'NY Liberty Fanatics Import (Nightly)',
      data_source: 'Fanatics SFTP',
    },
    {
      short_description: 'Archtics Ticketing Incremental',
      trigger: 'Schedule - Bi-Hourly',
      data_destination: 'bsedw.archtics_bse Postgres Table',
      integration_name: 'Archtics Sync BSE',
      cls: 'Integration',
      original_data_source: 'Archtics TM',
      pk: 'BSE',
      id: 'INTEGRATION#01GW06NGJBFKKSC731CJSX12V7',
      display_name: 'Archtics Sync BSE',
      data_source: 'Archtics TM',
    },
    {
      short_description: 'Archtics Ticketing Incremental',
      trigger: 'Schedule - Bi-Hourly',
      data_destination: 'livenation.archtics_lnpss Postgres Table',
      integration_name: 'archtics-ticketing-inc-lnpss',
      cls: 'Integration',
      original_data_source: 'Archtics TM',
      pk: 'LNPSS',
      id: 'INTEGRATION#01GVKCR9[AWS_ACCESS_KEY]',
      display_name: 'Archtics Sync',
      data_source: 'Archtics TM',
    },
    {
      short_description: 'Blinkfire API Ingest',
      trigger: 'Schedule - Nightly',
      data_destination: 'DWA',
      integration_name: 'wild_blinkfire_pull',
      cls: 'Integration',
      original_data_source: 'Blinkfire',
      pk: 'WILD',
      id: 'INTEGRATION#01G52CJ08V1GHFEXQ0JTZYBJ3P',
      display_name: 'Inbound Connector: Blinkfire',
      data_source: 'Blinkfire',
    },
    {
      short_description: 'Pull SFDC entities into Postgres',
      trigger: 'Schedule - Nightly',
      data_destination: 'Postgres',
      integration_name: 'dynamo_sfdc_pull',
      cls: 'Integration',
      original_data_source: 'SFDC',
      pk: 'DYNAMO',
      id: 'INTEGRATION#01GTFSYCV8AEZ9Y10W0ZBN19MF',
      display_name: 'SFDC Pull',
      data_source: 'SFDC',
    },
    {
      short_description: 'Send SFDC accounts to FDP',
      trigger: 'Every 15 minutes',
      data_destination: 'FDP',
      integration_name: 'sfdc_to_fdp',
      cls: 'Integration',
      original_data_source: 'SFDC',
      pk: 'DYNAMO',
      id: 'INTEGRATION#01GVK1RGRFJHV45V221V0DCJK3',
      display_name: 'SFDC to FDP',
      data_source: 'Postgres',
    },
    {
      short_description: 'Load Trackng Extract SFMC files from S3',
      trigger: 'Schedule - Nightly',
      data_destination: 'Postgres',
      integration_name: 'dynamo_sfmc_s3_inbound',
      cls: 'Integration',
      original_data_source: 'Postgres',
      pk: 'DYNAMO',
      id: 'INTEGRATION#01GW0DEAGSWJSRV0DC0RF9M0Q1',
      display_name: 'SFMC S3 Inbound Nightly',
      data_source: 'Postgres',
    },
    {
      short_description: 'RT sync_from_dynamics sproc run nightly.',
      trigger: 'Schedule - Nightly',
      data_destination: 'Postgres',
      integration_name: 'gulls_sproc_sync_from_dynamics',
      cls: 'Integration',
      original_data_source: 'Postgres',
      pk: 'GULLS',
      id: 'INTEGRATION#01GMV06JCY6WMBDMSNEVN487Y0',
      display_name: 'RT sync_from_dynamics SP Nightly',
      data_source: 'Postgres',
    },
    {
      short_description: 'Salesforce data pull',
      trigger: 'Nightly @ 12pm EST',
      data_destination: 'Postgres',
      integration_name: 'swarm_salesforce_pull_nightly',
      cls: 'Integration',
      original_data_source: 'Salesforce',
      pk: 'SWARM',
      id: 'INTEGRATION#01G1NXCEDBMSXY74PH88938BBG',
      display_name: 'SFDC Pull (Nightly)',
      data_source: 'Salesforce',
    },
    {
      short_description: 'Load data from AXS Redshift to Postgres',
      trigger: 'Schedule - 7:00 a.m. (UTC)',
      data_destination: 'Postgres',
      integration_name: 'swarm_inbound_connector_axs_fullpull',
      cls: 'Integration',
      original_data_source: 'AXS',
      pk: 'SWARM',
      id: 'INTEGRATION#01G2AQ6QRMGCCVEP63TP47ZNHS',
      display_name: 'Inbound Connector: AXS (Full Pull)',
      data_source: 'AXS',
    },
    {
      short_description: 'Load data from AXS Redshift to Postgres',
      trigger: 'Schedule - Hourly from 11:00 p.m. - 5:00 p.m. (UTC)',
      data_destination: 'Postgres',
      integration_name: 'swarm_inbound_connector_axs_incremental',
      cls: 'Integration',
      original_data_source: 'AXS',
      pk: 'SWARM',
      id: 'INTEGRATION#01G2AQ9H975ZJ54YHQDTC74J5X',
      display_name: 'Inbound Connector: AXS (Incremental)',
      data_source: 'AXS',
    },
    {
      short_description:
        'Load SFMC files from a remote file system into Postgres',
      trigger: 'Schedule - 7:00 a.m. (UTC)',
      data_destination: 'Postgres',
      integration_name: 'swarm_inbound_connector_sfmc',
      cls: 'Integration',
      original_data_source: 'SFMC',
      pk: 'SWARM',
      id: 'INTEGRATION#01G2QSA76MCHK0ZQXEADJJ4Q6E',
      display_name: 'Inbound Connector: SFMC',
      data_source: 'SFMC',
    },
    {
      short_description: 'Sync selected Postgres table to SFDC and SFMC',
      trigger: 'Schedule - Hourly',
      data_destination: 'SFDC',
      integration_name: 'swarm_data_activation',
      cls: 'Integration',
      original_data_source: 'Postgres',
      pk: 'SWARM',
      id: 'INTEGRATION#01G4GP3N3JEWX1H13KF4CCFSA6',
      display_name: 'Data Activation',
      data_source: 'Postgres',
    },
    {
      short_description: 'Inbound Connector: Dash',
      trigger: 'Schedule - Nightly',
      data_destination: 'Postgres',
      integration_name: 'dash_inbound',
      cls: 'Integration',
      original_data_source: 'Dash',
      pk: 'TEST',
      id: 'INTEGRATION#01G751MC4QZFV641P9PX07QEZ1',
      display_name: 'Inbound Connector: Dash',
      data_source: 'Dash',
    },
    {
      short_description: 'Inbound Connector: SFDC',
      trigger: 'Nightly',
      data_destination: 'Postgres',
      integration_name: 'bclions_sfdc_pull',
      cls: 'Integration',
      original_data_source: 'SFDC',
      pk: 'TEST',
      id: 'INTEGRATION#01GA777P0TTT76YPTZJS1F60XB',
      display_name: 'Inbound Connector: SFDC',
      data_source: 'SFDC',
    },
    {
      short_description: 'Sync A Postgres Table to SFMC',
      trigger: 'Schedule - Nightly',
      data_destination: 'SFMC',
      integration_name: 'cavs_data_activation',
      cls: 'Integration',
      original_data_source: 'Postgres Table',
      pk: 'CAVALIERS',
      id: 'INTEGRATION#01FX915P9SAPQ6W6PZNWXH0PEH',
      display_name: 'Data Activation',
      data_source: 'Postgres Table',
    },
    {
      short_description: 'SFDC pulls with nightly full pull',
      trigger: 'Hourly: 8am-8pm EST, Nightly: 11pm EST',
      data_destination: 'Postgres',
      integration_name: 'cavs_sfdc_pull_hourly',
      cls: 'Integration',
      original_data_source: 'Salesforce',
      pk: 'CAVALIERS',
      id: 'INTEGRATION#01FY7VE3F4Q6H2W3T79WRYTHRZ',
      display_name: 'SFDC Pull (Hourly Opportunity)',
      data_source: 'Salesforce',
    },
    {
      short_description: 'SFDC nightly full pull',
      trigger: 'Nightly 11pm EST',
      data_destination: 'Postgres',
      integration_name: 'cavs_sfdc_pull_nightly',
      cls: 'Integration',
      original_data_source: 'Salesforce',
      pk: 'CAVALIERS',
      id: 'INTEGRATION#01FY7Y6CZEKP0N97GV12WTNSRE',
      display_name: 'SFDC Pull (Nightly Full)',
      data_source: 'Salesforce',
    },
    {
      short_description: 'Nightly pull from Appetize',
      trigger: 'Schedule - Nightly',
      data_destination: 'Postgres',
      integration_name: 'appetize_download_nightly',
      cls: 'Integration',
      original_data_source: 'Appetize',
      pk: 'CAVALIERS',
      id: 'INTEGRATION#01G0MBNPDD621PXB1ZRN462J85',
      display_name: 'Inbound Connector: Appetize',
      data_source: 'Appetize',
    },
    {
      short_description: 'Blinkfire API pull containing social media data',
      trigger: 'Nightly @ 12pm EST',
      data_destination: 'Postgres',
      integration_name: 'cavs_blinkfire_pull_nightly',
      cls: 'Integration',
      original_data_source: 'Blinkfire',
      pk: 'CAVALIERS',
      id: 'INTEGRATION#01G2QY0Q844AEKRQTGZG3FQMB9',
      display_name: 'Blinkfire Pull (Nightly)',
      data_source: 'Blinkfire',
    },
    {
      short_description: 'Daily inbound SFMC SFTP sync',
      trigger: 'Schedule - Daily @ 7am EST',
      data_destination: 'Postgres',
      integration_name: 'sftp_sfmc_sync',
      cls: 'Integration',
      original_data_source: 'SFMC SFTP',
      pk: 'CAVALIERS',
      id: 'INTEGRATION#01G2TFQ0X5SK8HQEV1HV626HGR',
      display_name: 'SFTP SFMC Sync (Daily)',
      data_source: 'SFMC SFTP',
    },
    {
      short_description: 'Nightly counterpoint import to postgres',
      trigger: 'Schedule - Nightly @ 2am EST',
      data_destination: 'Postgres',
      integration_name: 'cavs_counterpoint_import',
      cls: 'Integration',
      original_data_source: 'Counterpoint',
      pk: 'CAVALIERS',
      id: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
      display_name: 'Counterpoint Import (Nightly)',
      data_source: 'Counterpoint',
    },
  ]

  const data = [
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
      id: 'RUN#1678930837',
      pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
      run_start: '2023-03-16T01:40:37.000000+0000',
      run_end: '2023-03-16T03:38:01.000000+0000',
      runTotalTime: '117.40',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678887653',
      pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
      run_start: '2023-03-15T13:40:53.000000+0000',
      run_end: '2023-03-15T15:35:20.000000+0000',
      runTotalTime: '114.45',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678844795',
      pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
      run_start: '2023-03-15T01:46:35.000000+0000',
      run_end: '2023-03-15T03:40:07.000000+0000',
      runTotalTime: '113.53',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678801260',
      pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
      run_start: '2023-03-14T13:41:00.000000+0000',
      run_end: '2023-03-14T15:30:31.000000+0000',
      runTotalTime: '109.52',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678758029',
      pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
      run_start: '2023-03-14T01:40:29.000000+0000',
      run_end: '2023-03-14T03:29:52.000000+0000',
      runTotalTime: '109.38',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678714856',
      pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
      run_start: '2023-03-13T13:40:56.000000+0000',
      run_end: '2023-03-13T15:28:47.000000+0000',
      runTotalTime: '107.85',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678671648',
      pk: 'INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29',
      run_start: '2023-03-13T01:40:48.000000+0000',
      run_end: '2023-03-13T03:26:46.000000+0000',
      runTotalTime: '105.97',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678789589',
      pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
      run_start: '2023-03-14T10:26:29.000000+0000',
      run_end: '2023-03-14T10:26:59.000000+0000',
      runTotalTime: '0.50',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678685183',
      pk: 'INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589',
      run_start: '2023-03-13T05:26:23.000000+0000',
      run_end: '2023-03-13T05:26:50.000000+0000',
      runTotalTime: '0.45',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1679192181',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-19T02:16:21.000000+0000',
      run_end: '2023-03-19T02:18:10.000000+0000',
      runTotalTime: '1.82',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1679105783',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-18T02:16:23.000000+0000',
      run_end: '2023-03-18T02:18:09.000000+0000',
      runTotalTime: '1.77',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1678932986',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-16T02:16:26.000000+0000',
      run_end: '2023-03-16T02:18:16.000000+0000',
      runTotalTime: '1.83',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1678846555',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-15T02:15:55.000000+0000',
      run_end: '2023-03-15T02:17:42.000000+0000',
      runTotalTime: '1.78',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1678760182',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-14T02:16:22.000000+0000',
      run_end: '2023-03-14T02:18:09.000000+0000',
      runTotalTime: '1.78',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1678673800',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-13T02:16:40.000000+0000',
      run_end: '2023-03-13T02:18:49.000000+0000',
      runTotalTime: '2.15',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1679192181',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-19T02:16:21.000000+0000',
      run_end: '2023-03-19T02:18:10.000000+0000',
      runTotalTime: '1.82',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1679105783',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-18T02:16:23.000000+0000',
      run_end: '2023-03-18T02:18:09.000000+0000',
      runTotalTime: '1.77',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1678932986',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-16T02:16:26.000000+0000',
      run_end: '2023-03-16T02:18:16.000000+0000',
      runTotalTime: '1.83',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1678846555',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-15T02:15:55.000000+0000',
      run_end: '2023-03-15T02:17:42.000000+0000',
      runTotalTime: '1.78',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1678760182',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-14T02:16:22.000000+0000',
      run_end: '2023-03-14T02:18:09.000000+0000',
      runTotalTime: '1.78',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: ELOQUA',
      run_status: 'success',
      id: 'RUN#1678673800',
      pk: 'INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG',
      run_start: '2023-03-13T02:16:40.000000+0000',
      run_end: '2023-03-13T02:18:49.000000+0000',
      runTotalTime: '2.15',
      errorMsg: null,
    },
    {
      log_details: '1679018405',
      run_status: 'success',
      id: 'RUN#1679018405',
      pk: 'INTEGRATION#01G8EJY1NVJQKPX3FNFXVB3JQY',
      run_start: '2023-03-17T02:00:05.000000+0000',
      run_end: '2023-03-17T02:00:07.000000+0000',
      runTotalTime: '0.03',
      errorMsg: null,
    },
    {
      log_details: '1678932005',
      run_status: 'success',
      id: 'RUN#1678932005',
      pk: 'INTEGRATION#01G8EJY1NVJQKPX3FNFXVB3JQY',
      run_start: '2023-03-16T02:00:05.000000+0000',
      run_end: '2023-03-16T02:00:08.000000+0000',
      runTotalTime: '0.05',
      errorMsg: null,
    },
    {
      log_details: '1678759205',
      run_status: 'success',
      id: 'RUN#1678759205',
      pk: 'INTEGRATION#01G8EJY1NVJQKPX3FNFXVB3JQY',
      run_start: '2023-03-14T02:00:05.000000+0000',
      run_end: '2023-03-14T02:00:12.000000+0000',
      runTotalTime: '0.12',
      errorMsg: null,
    },
    {
      log_details: '1678672804',
      run_status: 'success',
      id: 'RUN#1678672805',
      pk: 'INTEGRATION#01G8EJY1NVJQKPX3FNFXVB3JQY',
      run_start: '2023-03-13T02:00:05.000000+0000',
      run_end: '2023-03-13T02:00:12.000000+0000',
      runTotalTime: '0.12',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1679190400',
      pk: 'INTEGRATION#01GVK1RGRFJHV45V221V0DCJK3',
      run_start: '2023-03-19T01:46:40.000000+0000',
      run_end: '2023-03-19T01:46:41.000000+0000',
      runTotalTime: '0.02',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1679181425',
      pk: 'INTEGRATION#01GVK1RGRFJHV45V221V0DCJK3',
      run_start: '2023-03-18T23:17:05.000000+0000',
      run_end: '2023-03-18T23:17:07.000000+0000',
      runTotalTime: '0.03',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1679160708',
      pk: 'INTEGRATION#01GVK1RGRFJHV45V221V0DCJK3',
      run_start: '2023-03-18T17:31:48.000000+0000',
      run_end: '2023-03-18T17:31:48.000000+0000',
      runTotalTime: '0.00',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1679110274',
      pk: 'INTEGRATION#01GVK1RGRFJHV45V221V0DCJK3',
      run_start: '2023-03-18T03:31:14.000000+0000',
      run_end: '2023-03-18T03:31:14.000000+0000',
      runTotalTime: '0.00',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678948273',
      pk: 'INTEGRATION#01GVK1RGRFJHV45V221V0DCJK3',
      run_start: '2023-03-16T06:31:13.000000+0000',
      run_end: '2023-03-16T06:31:14.000000+0000',
      runTotalTime: '0.02',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1679216754',
      pk: 'INTEGRATION#01GMV06JCY6WMBDMSNEVN487Y0',
      run_start: '2023-03-19T09:05:54.000000+0000',
      run_end: '2023-03-19T09:06:03.000000+0000',
      runTotalTime: '0.15',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1679130357',
      pk: 'INTEGRATION#01GMV06JCY6WMBDMSNEVN487Y0',
      run_start: '2023-03-18T09:05:57.000000+0000',
      run_end: '2023-03-18T09:06:09.000000+0000',
      runTotalTime: '0.20',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1679043969',
      pk: 'INTEGRATION#01GMV06JCY6WMBDMSNEVN487Y0',
      run_start: '2023-03-17T09:06:09.000000+0000',
      run_end: '2023-03-17T09:06:22.000000+0000',
      runTotalTime: '0.22',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678957558',
      pk: 'INTEGRATION#01GMV06JCY6WMBDMSNEVN487Y0',
      run_start: '2023-03-16T09:05:58.000000+0000',
      run_end: '2023-03-16T09:06:11.000000+0000',
      runTotalTime: '0.22',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678871134',
      pk: 'INTEGRATION#01GMV06JCY6WMBDMSNEVN487Y0',
      run_start: '2023-03-15T09:05:34.000000+0000',
      run_end: '2023-03-15T09:05:42.000000+0000',
      runTotalTime: '0.13',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678784788',
      pk: 'INTEGRATION#01GMV06JCY6WMBDMSNEVN487Y0',
      run_start: '2023-03-14T09:06:28.000000+0000',
      run_end: '2023-03-14T09:06:36.000000+0000',
      runTotalTime: '0.13',
      errorMsg: null,
    },
    {
      log_details: 'missing link',
      run_status: 'success',
      id: 'RUN#1678698349',
      pk: 'INTEGRATION#01GMV06JCY6WMBDMSNEVN487Y0',
      run_start: '2023-03-13T09:05:49.000000+0000',
      run_end: '2023-03-13T09:05:57.000000+0000',
      runTotalTime: '0.13',
      errorMsg: null,
    },
    {
      log_details: 'swarm_inbound_connector_axs',
      run_status: 'success',
      id: 'RUN#1678863624',
      pk: 'INTEGRATION#01G2AQ6QRMGCCVEP63TP47ZNHS',
      run_start: '2023-03-15T07:00:24.000000+0000',
      run_end: '2023-03-15T07:08:05.000000+0000',
      runTotalTime: '7.68',
      errorMsg: null,
    },
    {
      log_details: 'swarm_inbound_connector_sfmc',
      run_status: 'success',
      id: 'RUN#1678863651',
      pk: 'INTEGRATION#01G2QSA76MCHK0ZQXEADJJ4Q6E',
      run_start: '2023-03-15T07:00:51.000000+0000',
      run_end: '2023-03-15T07:01:26.000000+0000',
      runTotalTime: '0.58',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: SFMC',
      run_status: 'success',
      id: 'RUN#1678903273',
      pk: 'INTEGRATION#01G4GP3N3JEWX1H13KF4CCFSA6',
      run_start: '2023-03-15T18:01:13.000000+0000',
      run_end: '2023-03-15T18:01:18.000000+0000',
      runTotalTime: '0.08',
      errorMsg: null,
    },
    {
      log_details: 'Outbound Delivery: SFMC',
      run_status: 'success',
      id: 'RUN#1678730490',
      pk: 'INTEGRATION#01FX915P9SAPQ6W6PZNWXH0PEH',
      run_start: '2023-03-13T18:01:30.000000+0000',
      run_end: '2023-03-13T18:04:11.000000+0000',
      runTotalTime: '2.68',
      errorMsg: null,
    },
    {
      log_details: '1679119216',
      run_status: 'success',
      id: 'RUN#1679119216',
      pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
      run_start: '2023-03-18T06:00:16.000000+0000',
      run_end: '2023-03-18T06:01:01.000000+0000',
      runTotalTime: '0.75',
      errorMsg: null,
    },
    {
      log_details: '1679032814',
      run_status: 'success',
      id: 'RUN#1679032814',
      pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
      run_start: '2023-03-17T06:00:14.000000+0000',
      run_end: '2023-03-17T06:00:52.000000+0000',
      runTotalTime: '0.63',
      errorMsg: null,
    },
    {
      log_details: '1678860014',
      run_status: 'success',
      id: 'RUN#1678860014',
      pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
      run_start: '2023-03-15T06:00:14.000000+0000',
      run_end: '2023-03-15T06:00:51.000000+0000',
      runTotalTime: '0.62',
      errorMsg: null,
    },
  ]
  // END OF STATIC DATA

  const [selectedDomain, setSelectedDomain] = useState()
  const [zoomDomain, setZoomDomain] = useState()

  const handleZoom = (domain) => {
    setSelectedDomain(domain)
  }

  const handleBrush = (domain) => {
    setZoomDomain(domain)
  }

  const getRunsByCompany = (company) => {
    const companyIntegrations = integrations.filter(
      (integration) => integration.pk === company
    )
    let companyRuns = []
    companyIntegrations.forEach((integration) => {
      const runs = data.filter((run) => run.pk === integration.id)
      companyRuns = [...companyRuns, ...runs]
    })
    return companyRuns
  }

  const getCompanyName = (integrationId) => {
    return integrations.find((i) => i.id === integrationId).pk
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-evenly items-center">
        <div className="flex flex-col">
          <button className="btn-dark">Reset Filters</button>
          <button className="btn-dark">Integrations with Errors</button>
          <button className="btn-dark">Data Source</button>
        </div>
        <div className="text-center">
          <div>
            <button className="btn-light">Last 24 Hours</button>
            <button className="btn-light">Last 3 Days</button>
            <button className="btn-light">Last Week</button>
          </div>
          <VictoryChart
            width={600}
            height={180}
            scale={{ y: 'time' }}
            domainPadding={8}
            padding={{ top: 16, right: 0, bottom: 50, left: 0 }}
            containerComponent={
              <VictoryBrushContainer
                responsive={false}
                brushDimension="y"
                brushDomain={selectedDomain}
                onBrushDomainChange={handleBrush}
              />
            }
          >
            <VictoryAxis
              dependentAxis={true}
              tickValues={[
                Date.parse('2023-03-13'),
                Date.parse('2023-03-14'),
                Date.parse('2023-03-15'),
                Date.parse('2023-03-16'),
                Date.parse('2023-03-17'),
                Date.parse('2023-03-18'),
                Date.parse('2023-03-19'),
              ]}
              tickLabelComponent={
                <VictoryLabel text="day" textAnchor="middle" />
              }
              style={{ grid: { stroke: 'grey', size: 5 } }}
            />
            <VictoryAxis
              style={{ grid: { stroke: 'grey', size: 5 } }}
              tickLabelComponent={<VictoryLabel text="" />}
            />
            <VictoryBar
              style={{
                data: {
                  fill: ({ datum }) =>
                    datum.run_status === 'success' ? '#317817' : '#A71B11',
                  stroke: ({ datum }) =>
                    datum.run_status === 'success' ? '#317817' : '#A71B11',
                  strokeWidth: 1.5,
                },
              }}
              data={data}
              horizontal={true}
              y={(d) => Date.parse(d.run_start)}
              y0={(d) => Date.parse(d.run_start) + 1 * 60 * 60 * 1000}
              barWidth={4}
              x="pk"
            />
          </VictoryChart>
        </div>
      </div>
      <VictoryChart
        width={1000}
        height={400}
        scale={{ y: 'time' }}
        padding={{ top: 0, right: 50, bottom: 50, left: 200 }}
        domainPadding={20}
        containerComponent={
          <VictoryZoomContainer
            responsive={false}
            zoomDimension="y"
            zoomDomain={zoomDomain}
            allowZoom={false}
            onZoomDomainChange={handleZoom}
          />
        }
      >
        <VictoryAxis
          style={{ grid: { stroke: 'grey', size: 5 } }}
          tickLabelComponent={<VictoryLabel />}
          tickFormat={(t) => getCompanyName(t)}
        />
        <VictoryAxis dependentAxis={true} />
        <VictoryGroup horizontal colorScale={['brown', 'tomato', 'gold']}>
          {companies &&
            companies.map((company, i) => {
              return (
                <VictoryBar
                  key={i}
                  style={{
                    data: {
                      //   fill: ({ datum }) =>
                      //     datum.run_status != 'success' ? '#317817' : '#A71B11',
                      //   stroke: ({ datum }) =>
                      //     datum.run_status === 'success' ? '#317817' : '#A71B11',
                      strokeWidth: 3,
                    },
                  }}
                  data={getRunsByCompany(company)}
                  horizontal={true}
                  y={(d) => Date.parse(d.run_start)}
                  y0={(d) => Date.parse(d.run_end)}
                  barWidth={10}
                  x="pk"
                  labels={({ datum }) =>
                    integrations.find((i) => i.id === datum.pk).display_name
                  }
                  labelComponent={<VictoryTooltip />}
                />
              )
            })}
        </VictoryGroup>
      </VictoryChart>
    </div>
  )
}

export default AdminTimeline
