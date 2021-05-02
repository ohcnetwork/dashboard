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
      {
        path: "/district/oxygen",
        name: "Oxygen",
      },
    ],
  },
  {
    href: "https://care.coronasafe.network/",
    name: "Care",
  },
  {
    href: "https://kerala.coronasafe.network/",
    name: "Kerala Dashboard",
  },
  {
    href: "https://kerala.coronasafe.network/hotspots",
    name: "Kerala Dashboard: Hotspots",
  },
];

export default routes;
