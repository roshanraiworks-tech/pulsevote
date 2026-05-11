import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import Home from "./pages/Home";
import CreatePoll from "./pages/CreatePoll";
import JoinPoll from "./pages/JoinPoll";
import LiveResults from "./pages/LiveResults";
import PollRoom from "./pages/PollRoom";
import MyPolls from "./pages/MyPolls";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function ProtectedLayout() {
  return (
    <>
      <AppNavbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-polls" element={<MyPolls />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/join" element={<JoinPoll />} />
          <Route path="/results" element={<LiveResults />} />
          <Route path="/poll/:pollCode" element={<PollRoom />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;