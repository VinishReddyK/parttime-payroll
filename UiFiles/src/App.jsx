import { Routes, Route } from "react-router-dom";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/employee/profile";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Profile />} />
          {/* <Route path="/" element={<Profile />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
