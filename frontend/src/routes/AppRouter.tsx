import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../components/Profile";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default AppRouter;
