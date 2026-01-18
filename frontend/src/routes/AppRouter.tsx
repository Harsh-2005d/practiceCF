import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/Profile";
import AuthCallback from "../pages/AuthCallBack";
import AuthFinish from "../pages/AuthFinish";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage handle={""} rank={""} rating={0} maxRank={""} best={0} email={""} isLogged={false} />} />
      <Route path="/auth/google/callback" element={<AuthCallback />} />
      <Route path="/auth/finish" element={<AuthFinish />} />

    </Routes>
  );
};

export default AppRouter;
