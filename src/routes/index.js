import { lazy } from "react";

const DistrictDashboard = lazy(() => import("../pages/DistrictDashboard"));
const Facility = lazy(() => import("../pages/Facility"));
const Asset = lazy(() => import("../pages/Asset"));
const Page404 = lazy(() => import("../pages/404"));

const routes = [
  {
    path: "/district",
    component: DistrictDashboard,
  },
  {
    path: "/district/:district/:content",
    component: DistrictDashboard,
  },
  {
    path: "/facility/:facilityId",
    component: Facility,
  },
  {
    path: "/asset/:assetId",
    component: Asset,
  },
  {
    path: "/404",
    component: Page404,
  },
];

export default routes;
