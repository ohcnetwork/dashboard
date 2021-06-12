import fetch from "unfetch";

export function careSummary(
  type,
  start_date,
  end_date,
  district,
  limit = 2000,
  facility = ""
) {
  return fetch(
    `/api/v1/${type}_summary/?` +
      new URLSearchParams({
        start_date,
        end_date,
        district,
        limit,
        facility,
      })
  ).then((r) => r.json());
}
