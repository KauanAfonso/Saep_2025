import { Routes, Route } from "react-router-dom";
import Login from "./telas/Login";
import Home from "./telas/Home";
import Estoque from "./telas/Estoque/Estoque";
import { Log } from "./telas/Log/Log";
import { Usuarios } from "./telas/Usuarios/Usuarios";
import Produtos from "./telas/Produtos/Produtos";
import PrivateRoute from "./PrivateRoute";

export default function RouteKauan() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/estoque" element={<PrivateRoute><Estoque /></PrivateRoute>} />
      <Route path="/produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
      <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
      <Route path="/log" element={<PrivateRoute><Log /></PrivateRoute>} />

    </Routes>
  );
}
