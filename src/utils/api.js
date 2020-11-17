import fetch from "unfetch";

export function careSummary(
  type,
  start_date,
  end_date,
  district,
  limit = 2000
) {
  return fetch(
    `/api/v1/${type}_summary/?` +
      new URLSearchParams({
        start_date,
        end_date,
        district,
        limit,
      })
  ).then((r) => r.json());
}

export function covidGetHistories() {
  return fetch("https://keralastats.coronasafe.live/histories.json").then((r) =>
    r.json()
  );
}

export function covidGetHotspotHistories() {
  return fetch(
    "https://keralastats.coronasafe.live/hotspots_histories.json"
  ).then((r) => r.json());
}
