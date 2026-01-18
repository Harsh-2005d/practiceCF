import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/newdash";
import ProfilePage from "../pages/Profile";
import AuthFinish from "../pages/AuthFinish";

const AppRouter = () => {
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/auth/finish" element={<AuthFinish />} />

    </Routes>
  );
};

export default AppRouter;
