import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;