import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import Calendar from "../pages/Calendar";
import Doctor from "../pages/Doctor";
import Profile from "../pages/Profile";
import Reports from "../pages/Reports";
import PasswordResetEmail from "../pages/PasswordResetEmail";
import ChangePassword from "../pages/ChangePassword";

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container-fluid container-md">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/passwordReset" element={<PasswordResetEmail />}/>
          <Route path="/passwordReset/:id" element={<ChangePassword />}/>
          <Route element={<ProtectedRoute />}>
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/calendar/:id" element={<Calendar />} />
            <Route path="/doctors" element={<Doctor />} />
            <Route path="/doctors/:id" element={<Doctor />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default Router;