// Activated Districts
export const ACTIVATED_DISTRICTS = [
  { id: 7, name: "Ernakulam", lat: 10.148_547_6, lng: 76.500_752_4, zoom: 10 },
];

export const GMAP_KEY = "AIzaSyDsBAc3y7deI5ZO3NtK5GuzKwtUzQNJNUk";

export const AVAILABILITY_TYPES_ORDERED = [
  1, 150, 10, 20, 30, 120, 110, 100, 40, 60, 50, 70,
];

export const ORDINARY = [4444, 30, 1, 4];
export const OXYGEN = [3333, 120, 150, 60];
export const ICU = [2222, 110, 10, 50];
export const VENTILATOR = [1111, 100, 20, 70];

export const AVAILABILITY_TYPES_TOTAL_ORDERED = [
  { id: 4444, name: "Ordinary Bed", non_covid: 1, covid: 30 },
  { id: 3333, name: "Oxygen Beds", non_covid: 150, covid: 120 },
  { id: 2222, name: "ICU", non_covid: 10, covid: 110 },
  { id: 1111, name: "Ventilator", non_covid: 20, covid: 100 },
];

export const AVAILABILITY_TYPES = {
  20: "Non-Covid Ventilator",
  10: "Non-Covid ICU",
  150: "Non-Covid Oxygen Beds",
  1: "Non-Covid Ordinary Bed",
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
  20: "Non-Covid",
  10: "Non-Covid",
  150: "Non-Covid",
  1: "Non-Covid",
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
  home_isolation: "Home Isolation",
  isolation_room: "Isolation Room",
  bed_with_oxygen_support: "Bed with Oxygen Support",
  icu: "ICU",
  icu_with_oxygen_support: "ICU with Oxygen Support",
  icu_with_non_invasive_ventilator: "ICU with Non Invasive ventilator",
  icu_with_invasive_ventilator: "ICU with Invasive ventilator",
  gynaecology_ward: "Gynaecology Ward",
  paediatric_ward: "Paediatric Ward",
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

// Table title
export const OXYGEN_TYPES = {
  liquid: "Liquid Oxygen",
  type_d: "Cylinder D",
  type_c: "Cylinder C",
  type_b: "Cylinder B",
};

// ID from care DB
export const OXYGEN_INVENTORY = {
  liquid: 2,
  type_d: 4,
  type_c: 6,
  type_b: 5,
};

// Reverse Dict for OXYGEN_INVENTORY
export const OXYGEN_TYPES_KEYS = Object.entries(OXYGEN_INVENTORY).reduce(
  (acc, [key, value]) => acc && { ...acc, [value]: key },
  {}
);

// Name from care DB, used to compute district summary
export const OXYGEN_INVENTORY_NAME = {
  liquid: "Liquid Oxygen",
  type_d: "Jumbo D Type Oxygen Cylinder",
  type_c: "C Type Oxygen Cylinder",
  type_b: "B Type Oxygen Cylinder",
};

export const OXYGEN_CAPACITY_TRANSLATION = {
  liquid: "oxygenCapacity",
  type_d: "type_d_cylinders",
  type_c: "type_c_cylinders",
  type_b: "type_b_cylinders",
};

export const CONTENT = {
  CAPACITY: 1,
  PATIENT: 2,
  TESTS: 3,
  TRIAGE: 4,
  LSG: 6,
  OXYGEN: 7,
  MAP: 8,
};
