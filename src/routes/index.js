import { lazy } from "react";

const DistrictDashboard = lazy(() => import("../pages/DistrictDashboard"));
const Facility = lazy(() => import("../pages/Facility"));
const Page404 = lazy(() => import("../pages/404"));

const routes = [
  {
    path: "/district",
    component: DistrictDashboard,
  },
  {
    path: "/district/:content",
    component: DistrictDashboard,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/facility/:facilityId",
    component: Facility,
  },
];

export default routes;
