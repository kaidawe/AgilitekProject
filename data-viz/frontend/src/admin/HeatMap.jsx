import React from "react";
import Tooltip from "@uiw/react-tooltip";
import HeatMap from "@uiw/react-heat-map";
import axios from "axios";
import { useState, useEffect } from "react";
import { customersAPI, integrationsAPI, runsAPI } from "../globals/globals";

const value = [
  { date: "2016/01/01 00:00:00", count: 2 },
  { date: "2016/01/01 01:00:00", count: 5 },
  { date: "2016/01/01 02:00:00", count: 3 },
  { date: "2016/01/01 03:00:00", count: 1 },
  { date: "2016/01/01 04:00:00", count: 7 },
  { date: "2016/01/01 05:00:00", count: 4 },
  { date: "2016/01/01 06:00:00", count: 8 },
  { date: "2016/01/01 07:00:00", count: 11 },
  { date: "2016/01/01 08:00:00", count: 32 },
  { date: "2016/01/01 09:00:00", count: 20 },
  { date: "2016/01/01 10:00:00", count: 9 },
  { date: "2016/01/01 11:00:00", count: 6 },
  { date: "2016/01/01 12:00:00", count: 8 },
  { date: "2016/01/01 13:00:00", count: 16 },
  { date: "2016/01/01 14:00:00", count: 12 },
  { date: "2016/01/01 15:00:00", count: 5 },
  { date: "2016/01/01 16:00:00", count: 3 },
  { date: "2016/01/01 17:00:00", count: 7 },
  { date: "2016/01/01 18:00:00", count: 13 },
  { date: "2016/01/01 19:00:00", count: 18 },
  { date: "2016/01/01 20:00:00", count: 23 },
  { date: "2016/01/01 21:00:00", count: 15 },
  { date: "2016/01/01 22:00:00", count: 10 },
  { date: "2016/01/01 23:00:00", count: 6 },
];

const getCurrentWeek = () => {};

const AdminHeatMap = () => {
  return (
    <HeatMap
      value={value}
      width={1000}
      startDate={new Date("2016/01/01 00:00:00")}
      xLabels={[
        "12AM",
        "1AM",
        "2AM",
        "3AM",
        "4AM",
        "5AM",
        "6AM",
        "7AM",
        "8AM",
        "9AM",
        "10AM",
        "11AM",
        "12PM",
        "1PM",
        "2PM",
        "3PM",
        "4PM",
        "5PM",
        "6PM",
        "7PM",
        "8PM",
        "9PM",
        "10PM",
        "11PM",
      ]}
      rectRender={(props, data) => {
        return (
          <Tooltip
            key={props.key}
            placement="top"
            content={`count: ${data.count || 0}`}
          >
            <rect {...props} />
          </Tooltip>
        );
      }}
    />
  );
};

export default AdminHeatMap;
