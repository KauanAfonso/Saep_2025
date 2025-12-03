import { Routes, Route } from "react-router-dom";

import Home from "./telas/Home.jsx";
import Login from "./telas/login.jsx";
import { Produtos } from "./telas/Produtos/Produtos.jsx";
import { Estoque } from "./telas/Estoque/Estoque.jsx"

export function RouteKauan() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/produtos" element={<Produtos/>}/>
      <Route path="/estoque" element={<Estoque/>}/>

    </Routes>
  );
}
