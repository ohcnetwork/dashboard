import axios from "axios";

export const getNDateBefore = (d, n) => {
  var dt = new Date(d);
  return new Date(dt.setDate(dt.getDate() - n));
};

export const getNDateAfter = (d, n) => {
  var dt = new Date(d);
  return new Date(dt.setDate(dt.getDate() + n));
};

export const dateString = (d) => {
  return d.toISOString().substring(0, 10);
};

export const getLSGD = () => {
  return axios.get("/kerala_lsgd.json");
};

export const getDistrict = () => {
  return axios.get("/kerala_district.json");
};
