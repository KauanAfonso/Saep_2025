import { Routes, Route } from "react-router-dom";

import Home from "./telas/Home.jsx";
import Login from "./telas/login.jsx";

export function RouteKauan() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
