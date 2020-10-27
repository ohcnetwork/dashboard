import axios from "axios";

const API_BASE_URL = process.env.POI_APP_CARE_BASE_URL || "";
const STAT_BASE_URL = "https://keralastats.coronasafe.live";

const request = (options) => {
  const headers = {
    "Content-Type": "application/json",
  };
  Object.assign(options, { headers });
  return axios(options).then((response) => {
    return response.data;
  });
};

export function careSummary(
  type,
  start_date,
  end_date,
  district,
  limit = 2000
) {
  return request({
    url: `${API_BASE_URL}/api/v1/${type}_summary/`,
    method: "GET",
    params: {
      start_date,
      end_date,
      district,
      limit,
    },
  });
}

export function covidGetHistories() {
  return request({
    url: `${STAT_BASE_URL}/histories.json`,
    method: "GET",
  });
}

export function covidGetHotspotHistories() {
  return request({
    url: `${STAT_BASE_URL}/hotspots_histories.json`,
    method: "GET",
  });
}
