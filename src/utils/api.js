import axios from "axios";

const API_BASE_URL = process.env.POI_APP_CARE_BASE_URL || "";
const STAT_BASE_URL = "https://keralastats.coronasafe.live";

const request = (options, token) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    Object.assign(headers, { Authorization: `Bearer ${token}` });
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
    url: `${API_BASE_URL}/api/v1/auth/token/refresh/`,
    method: "POST",
    data: { refresh },
  });
}

export function careLogin(data) {
  return request({
    url: `${API_BASE_URL}/api/v1/auth/login/`,
    method: "POST",
    data,
  });
}

export function careGetCurrentUser(token) {
  return request(
    {
      url: `${API_BASE_URL}/api/v1/users/getcurrentuser/`,
      method: "GET",
    },
    token
  );
}

export function careSummary(
  token,
  type,
  start_date,
  end_date,
  district,
  limit = 2000
) {
  return request(
    {
      url: `${API_BASE_URL}/api/v1/${type}_summary/`,
      method: "GET",
      params: {
        start_date,
        end_date,
        district,
        limit,
      },
    },
    token
  );
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
