import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import Health from "./pages/Health";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/code/:code" element={<StatsPage/>} />
        <Route path="/health" element={<Health/>} />
      </Routes>
    </BrowserRouter>
  );
}