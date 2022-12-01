import fetch from "unfetch";

export function careSummary(
  type,
  start_date,
  end_date,
  district,
  limit = 2000
) {
  if (district == 99) {
    return fetch(
      `/api/v1/${type}_summary/?` +
        new URLSearchParams({
          start_date,
          end_date,
          state: 2,
          limit,
        })
    ).then((r) => r.json());
  } else {
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
}

export function individualCareSummary(type, start_date, end_date, facility) {
  return fetch(
    `/api/v1/${type}_summary/?` +
      new URLSearchParams({
        start_date,
        end_date,
        facility,
      })
  ).then((r) => r.json());
}
