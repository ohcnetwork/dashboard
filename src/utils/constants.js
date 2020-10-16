export const DISTRICTS = [
  { id: 1, name: "Thiruvananthapuram" },
  { id: 2, name: "Kollam" },
  { id: 3, name: "Pathanamthitta" },
  { id: 4, name: "Alappuzha" },
  { id: 5, name: "Kottayam" },
  { id: 6, name: "Idukki" },
  { id: 7, name: "Ernakulam" },
  { id: 8, name: "Thrissur" },
  { id: 9, name: "Palakkad" },
  { id: 10, name: "Malappuram" },
  { id: 11, name: "Kozhikode" },
  { id: 12, name: "Wayanad" },
  { id: 13, name: "Kannur" },
  { id: 14, name: "Kasaragod" },
];

export const AVAILABILITY_TYPES = {
  20: "Ventilators",
  10: "ICUs",
  1: "Rooms",
  30: "Covid Beds",
  3: "Rooms w/ Bathroom",
  2: "Hostels",
  40: "KASP Beds",
  50: "KASP ICU Beds",
};

export const PATIENT_TYPES = {
  home_quarantine: "Home quarantine",
  isolation: "Isolation",
  icu: "ICU",
  ventilator: "Ventilator",
};

export const TESTS_TYPES = {
  result_awaited: "Result awaited",
  test_discarded: "Tests discarded",
  total_patients: "Total patients",
  result_negative: "Negative results",
  result_positive: "Positive results",
};

export const TRIAGE_TYPES = {
  avg_patients_visited: "Average patients visited",
  avg_patients_referred: "Average patients referred",
  avg_patients_isolation: "Average patients isolation",
  avg_patients_home_quarantine: "Average patients home quarantine",
  total_patients_visited: "Total patients visited",
  total_patients_referred: "Total patients referred",
  total_patients_isolation: "Total patients isolation",
  total_patients_home_quarantine: "Total patients home quarantine",
};

export const FACILITY_TYPES = [
  "Educational Inst",
  "Private Hospital",
  "Other",
  "Hostel",
  "Hotel",
  "Lodge",
  "TeleMedicine",
  "Govt Hospital",
  "Labs",
  "Primary Health Centres",
  "24x7 Public Health Centres",
  "Family Health Centres",
  "Community Health Centres",
  "Urban Primary Health Center",
  "Taluk Hospitals",
  "Taluk Headquarters Hospitals",
  "Women and Child Health Centres",
  "General hospitals",
  "District Hospitals",
  "Govt Medical College Hospitals",
  "Corona Testing Labs",
  "Corona Care Centre",
  "COVID-19 Domiciliary Care Center",
  "First Line Treatment Centre",
  "Second Line Treatment Center",
  "Shifting Centre",
  "Covid Management Center",
  "Unknown",
];

export const CONTENT = {
  CAPACITY: 1,
  PATIENT: 2,
  TESTS: 3,
  TRIAGE: 4,
  COVID: 5,
};
