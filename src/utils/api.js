import axios from "axios";

const API_BASE_URL = "https://care.coronasafe.network";
const STAT_BASE_URL = "https://keralastats.coronasafe.live";

const request = (options, token) => {
  let headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    Object.assign(headers, { Authorization: "Bearer " + token });
  }
  Object.assign(options, { headers });
  return axios(options).then((response) => {
    return response.data;
  });
};

export function careRefreshToken(access, refresh) {
  if (!access && refresh) {
    document.location.reload();
    return;
  }
  if (!refresh) {
    return;
  }
  return request({
    url: API_BASE_URL + "/api/v1/auth/token/refresh/",
    method: "POST",
    data: { refresh },
  });
}

export function careLogin(data) {
  return request({
    url: API_BASE_URL + "/api/v1/auth/login/",
    method: "POST",
    data: data,
  });
}

export function careFacilitySummary(token) {
  return request(
    {
      url: API_BASE_URL + "/api/v1/facility_summary/?limit=2000",
      method: "GET",
    },
    token
  );
}

export function carePatientSummary(token) {
  return request(
    {
      url: API_BASE_URL + "/api/v1/patient_summary/",
      method: "GET",
    },
    token
  );
}

export function getCurrentUser(token) {
  return request(
    {
      url: API_BASE_URL + "/api/v1/users/getcurrentuser/",
      method: "GET",
    },
    token
  );
}

export function getCovidStats() {
  return request({
    url: STAT_BASE_URL + "/latest.json",
    method: "GET",
  });
}
