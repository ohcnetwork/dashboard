import axios from "axios";

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
    url: `/api/v1/${type}_summary/`,
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
    url: `https://keralastats.coronasafe.live/histories.json`,
    method: "GET",
  });
}

export function covidGetHotspotHistories() {
  return request({
    url: `https://keralastats.coronasafe.live/hotspots_histories.json`,
    method: "GET",
  });
}
