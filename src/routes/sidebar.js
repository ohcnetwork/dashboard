import { Home } from "react-feather";

const routes = [
  {
    icon: Home,
    name: "District Dashboard",
    routes: [
      {
        path: "/app/district/capacity",
        name: "Capacity",
      },
      {
        path: "/app/district/patient",
        name: "Patient",
      },
      {
        path: "/app/district/tests",
        name: "Tests",
      },
      {
        path: "/app/district/covid",
        name: "Covid",
      },
    ],
  },
];

export default routes;
