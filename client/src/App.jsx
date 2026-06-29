import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateCapsule from "./pages/CreateCapsule";
import MyCapsules from "./pages/MyCapsules";
import ReceivedCapsules from "./pages/ReceivedCapsules";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-capsule" element={<CreateCapsule />} />
          <Route path="/my-capsules" element={<MyCapsules />} />
          <Route path="/received" element={<ReceivedCapsules />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;