import axios from "axios";

const API_BASE_URL =
  process.env.POI_APP_CARE_BASE_URL || "https://care.coronasafe.in";
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

export function careFacilitySummary(token, start_date, end_date) {
  return request(
    {
      url: API_BASE_URL + "/api/v1/facility_summary/?limit=2000",
      method: "GET",
      params: {
        start_date,
        end_date,
      },
    },
    token
  );
}

export function carePatientSummary(token, start_date, end_date) {
  return request(
    {
      url: API_BASE_URL + "/api/v1/patient_summary/?limit=2000",
      method: "GET",
      params: {
        start_date,
        end_date,
      },
    },
    token
  );
}

export function careTestsSummary(token, start_date, end_date) {
  return request(
    {
      url: API_BASE_URL + "/api/v1/tests_summary/?limit=2000",
      method: "GET",
      params: {
        start_date,
        end_date,
      },
    },
    token
  );
}

export function careGetCurrentUser(token) {
  return request(
    {
      url: API_BASE_URL + "/api/v1/users/getcurrentuser/",
      method: "GET",
    },
    token
  );
}

export function covidGetLatest() {
  return request({
    url: STAT_BASE_URL + "/latest.json",
    method: "GET",
  });
}
