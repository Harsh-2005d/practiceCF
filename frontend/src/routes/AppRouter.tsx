import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../components/Profile";
import AuthCallback from "../pages/AuthCallBack";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage handle={""} rank={""} rating={0} maxRank={""} best={0} email={""} isLogged={false} />} />
      <Route path="/auth/google/callback" element={<AuthCallback />} />
    </Routes>
  );
};

export default AppRouter;
