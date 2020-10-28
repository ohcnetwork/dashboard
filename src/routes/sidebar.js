const routes = [
  {
    name: "District Dashboard",
    routes: [
      {
        path: "/district/capacity",
        name: "Capacity",
      },
      {
        path: "/district/patient",
        name: "Patient",
      },
      {
        path: "/district/tests",
        name: "Tests",
      },
      {
        path: "/district/covid",
        name: "Covid",
      },
    ],
  },
  {
    href: "https://care.coronasafe.network/",
    name: "Care",
  },
  {
    href: "https://keralamap.coronasafe.network/",
    name: "Covid Dashboard",
  },
  {
    href: "https://hotspots.coronasafe.network/",
    name: "Hotspots Map",
  },
];

export default routes;
