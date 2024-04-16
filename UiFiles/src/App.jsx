import { Routes, Route } from "react-router-dom";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/employee/profile";
import Layout from "./components/Layout";
import ManageEmployees from "./components/user/ManageEmployees";
import Timesheet from "./components/employee/Timesheet";
import Schedules from "./components/schedule";
import Swap from "./components/employee/Swap";
import Leave from "./components/employee/Leave";
import Overtime from "./components/employee/Overtime";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Profile />} />
          <Route path="/manage" element={<ManageEmployees />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/overtime" element={<Overtime />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
