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

export const AVAILABILITY_TYPES_ORDERED = [
  20,
  10,
  150,
  1,
  100,
  110,
  120,
  30,
  70,
  50,
  60,
  40,
];

export const AVAILABILITY_TYPES = {
  20: "Ventilator",
  10: "ICU",
  150: "Oxygen Beds",
  1: "Ordinary Bed",
  70: "KASP Ventilator",
  50: "KASP ICU",
  60: "KASP Oxygen Beds",
  40: "KASP Ordinary Bed",
  100: "Covid ICU w/ Ventilator",
  110: "Covid ICU",
  120: "Covid Oxygen Beds",
  30: "Covid Ordinary Bed",
};

export const AVAILABILITY_TYPES_PROXY = {
  20: "Total",
  10: "Total",
  150: "Total",
  1: "Total",
  70: "KASP",
  50: "KASP",
  60: "KASP",
  40: "KASP",
  100: "Covid",
  110: "Covid",
  120: "Covid",
  30: "Covid",
};

export const PATIENT_TYPES = {
  icu: "ICU",
  oxygen_bed: "Oxygen Bed",
  not_admitted: "Not Admitted",
  home_isolation: "Home Isolation",
  isolation_room: "Isolation Room",
  home_quarantine: "Home Quarantine",
  paediatric_ward: "Paediatric Ward",
  gynaecology_ward: "Gynaecology Ward",
  icu_with_invasive_ventilator: "Icu w/ Invasive Ventilator",
  icu_with_non_invasive_ventilator: "Icu w/ Non-Invasive Ventilator",
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

export const GOVT_FACILITY_TYPES = [
  "Govt Hospital",
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
];

export const FACILITY_TYPES = [
  ...GOVT_FACILITY_TYPES,
  "Private Hospital",
  "First Line Treatment Centre",
  "Second Line Treatment Center",
  "COVID-19 Domiciliary Care Center",
  "Corona Care Centre",
  "Covid Management Center",
  "Shifting Centre",
  "TeleMedicine",
];

export const CONTENT = {
  CAPACITY: 1,
  PATIENT: 2,
  TESTS: 3,
  TRIAGE: 4,
  COVID: 5,
};
