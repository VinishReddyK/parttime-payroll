import { Routes, Route } from "react-router-dom";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/employee/profile";
import Layout from "./components/Layout";
import ManageEmployees from "./components/user/ManageEmployees";
import Timesheet from "./components/employee/Timesheet";
import Schedules from "./components/schedule";

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
        </Route>
      </Routes>
    </>
  );
}

export default App;
