import axios from "axios";

const careSummary = async (
  type: string,
  start_date: string,
  end_date: string,
  district: string,
  limit = 2000
) => {
  return axios
    .get(`/api/v1/${type}_summary`, {
      params: {
        start_date,
        end_date,
        district,
        limit,
      },
    })
    .then((response) => response.data)
    .catch(console.log);
};

const individualCareSummary = async (
  type: string,
  start_date: string,
  end_date: string,
  facility: string
) => {
  return axios
    .get(`/api/v1/${type}_summary/`, {
      params: {
        start_date,
        end_date,
        facility,
      },
    })
    .then((response) => response.data)
    .catch(console.log);
};

export { careSummary, individualCareSummary };
