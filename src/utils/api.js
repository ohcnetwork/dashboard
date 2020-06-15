const API_BASE_URL = "https://care.coronasafe.network"
const ACCESS_TOKEN = "care_access_token"
const REFRESH_TOKEN = "care_refresh_token"

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response => [response.ok,response.json()])
        .then(([status,json]) => {
                console.log("JSON Received")
                if(!status) {
                    return Promise.reject(json);
                }
                return json;
            });
};

export const updateRefreshToken = () => {
    const refresh = localStorage.getItem(ACCESS_TOKEN);
    const access = localStorage.getItem(REFRESH_TOKEN); 
    if (!access && refresh){ 
      localStorage.removeItem(REFRESH_TOKEN);
      document.location.reload();
      return;
    }
    if (!refresh) {
      return;
    }
    refreshRequest({refresh}).then((resp) => { 
        localStorage.setItem(ACCESS_TOKEN, resp.data.access)
        localStorage.setItem(REFRESH_TOKEN, resp.data.refresh);
    }).catch( (ex)=> {
      console.error('Error while refreshing',ex);
    });
  
} 
export function refreshRequest(data) {
    return request({
        url: API_BASE_URL + "/api/v1/auth/token/refresh/",
        method: 'POST',
        body: JSON.stringify(data)
    });
}
export function login(data) {
    return request({
        url: API_BASE_URL + "/api/v1/auth/login/",
        method: 'POST',
        body: JSON.stringify(data)
    });
}
export function getCapacitySummary() {
    return request({
        url: API_BASE_URL + "/api/v1/facility_summary/",
        method: 'GET'
    });
}