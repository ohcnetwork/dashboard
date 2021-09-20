// Activated Districts
export const ACTIVATED_DISTRICTS = [
  { id: "15", name: "Tiruvallur", lat: "13.266", lng: "79.9331", zoom: 10 },
  { id: "16", name: "Chennai", lat: "13.0629", lng: "80.2315", zoom: 10 },
  { id: "17", name: "Kancheepuram", lat: "12.833", lng: "79.8386", zoom: 10 },
  { id: "18", name: "Vellore", lat: "12.901", lng: "78.9493", zoom: 10 },
  { id: "19", name: "Dharmapuri", lat: "12.1005", lng: "78.1932", zoom: 10 },
  { id: "20", name: "Tiruvannamalai", lat: "12.489", lng: "79.1665", zoom: 10 },
  { id: "21", name: "Villupuram", lat: "12.1237", lng: "79.529", zoom: 10 },
  { id: "22", name: "Salem", lat: "11.6773", lng: "78.2222", zoom: 10 },
  { id: "23", name: "Namakkal", lat: "11.3187", lng: "78.1357", zoom: 10 },
  { id: "24", name: "Erode", lat: "11.5177", lng: "77.4129", zoom: 10 },
  { id: "25", name: "The Nilgiris", lat: "11.4573", lng: "76.6403", zoom: 10 },
  { id: "26", name: "Coimbatore", lat: "10.8777", lng: "76.9766", zoom: 10 },
  { id: "27", name: "Dindigul", lat: "10.392", lng: "77.82", zoom: 10 },
  { id: "28", name: "Karur", lat: "10.899", lng: "78.1343", zoom: 10 },
  { id: "29", name: "Tiruchirapalli", lat: "10.98", lng: "78.5703", zoom: 10 },
  { id: "30", name: "Perambalur", lat: "11.2749", lng: "78.8919", zoom: 10 },
  { id: "31", name: "Ariyalur", lat: "11.1624", lng: "79.2441", zoom: 10 },
  { id: "32", name: "Cuddalore", lat: "11.5354", lng: "79.45", zoom: 10 },
  { id: "33", name: "Nagapattinam", lat: "10.5741", lng: "79.7624", zoom: 10 },
  { id: "34", name: "Tiruvarur", lat: "10.6754", lng: "79.5335", zoom: 10 },
  { id: "35", name: "Thanjavur", lat: "10.6702", lng: "79.2406", zoom: 10 },
  { id: "36", name: "Pudukkottai", lat: "10.3602", lng: "78.8792", zoom: 10 },
  { id: "37", name: "Sivagangai", lat: "9.91436", lng: "78.5966", zoom: 10 },
  { id: "38", name: "Madurai", lat: "9.92266", lng: "78.0057", zoom: 10 },
  { id: "39", name: "Theni", lat: "9.89215", lng: "77.4387", zoom: 10 },
  { id: "40", name: "Virudhunagar", lat: "9.4925", lng: "77.9052", zoom: 10 },
  { id: "41", name: "Ramanathapuram", lat: "9.376", lng: "78.6869", zoom: 10 },
  { id: "42", name: "Thoothukudi", lat: "8.90295", lng: "77.9979", zoom: 10 },
  { id: "43", name: "Tirunelveli", lat: "8.57863", lng: "77.6028", zoom: 10 },
  { id: "44", name: "Kanniyakumari", lat: "8.30789", lng: "77.3598", zoom: 10 },
  { id: "45", name: "Krishnagiri", lat: "12.646", lng: "78.0313", zoom: 10 },
  { id: "46", name: "Tiruppur", lat: "10.8393", lng: "77.4081", zoom: 10 },
  { id: "47", name: "Ranipet", lat: "12.95", lng: "79.4618", zoom: 10 },
  { id: "48", name: "Kallakurichi", lat: "11.7982", lng: "79.0126", zoom: 10 },
  { id: "49", name: "Tirupathur", lat: "12.5733", lng: "78.6406", zoom: 10 },
  { id: "50", name: "Tenkasi", lat: "9.07795", lng: "77.4463", zoom: 10 },
  { id: "51", name: "Chengalpattu", lat: "12.5714", lng: "79.9963", zoom: 10 },
  {
    id: "53",
    name: "Mayiladuthurai",
    lat: "11.1529",
    lng: "79.7096",
    zoom: 10,
  },
];

export const GMAP_KEY = "AIzaSyCd-dCJ0kZggouOsYQ9onr87k03CnZxUOg";

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
