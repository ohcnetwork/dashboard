import arima from "arima";
import { expose } from "react-suspense-worker";

const arimaWorker = arima;

expose(arimaWorker);
