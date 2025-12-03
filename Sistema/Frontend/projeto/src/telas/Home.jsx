import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Olá, {user?.username}!</h2>

      <button onClick={logout} className="logout">Sair</button>

      <div className="nav">
        <ul>
          <li><Link to="/produtos">Produtos</Link></li>
          <li><Link to="/estoque">Estoque</Link></li>
          <li><Link to="/usuarios">Usuários</Link></li>
          <li><Link to="/log">Log</Link></li>
        </ul>
      </div>
    </div>
  );
}
