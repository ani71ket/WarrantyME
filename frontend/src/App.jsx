import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { initGoogleAuth } from "./utils/GoogleAuth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    initGoogleAuth();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
  );
}

export default App;
