import { Home } from "react-feather";

const routes = [
  {
    icon: Home,
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
];

export default routes;
